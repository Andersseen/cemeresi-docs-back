import { Response } from 'express';
import * as XLSX from 'xlsx';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { ExcelService } from './excel.service';

@Controller('excel')
export class ExcelController {
  constructor(private excelService: ExcelService) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file) {
    const workbook = XLSX.read(file.buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Obtener el rango completo de la hoja de cálculo
    const range = XLSX.utils.decode_range(worksheet['!ref']);

    // Ajustar el rango para comenzar desde la fila 5
    range.s.r = 5; // La primera fila es 0

    const rawData = [];
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const row = {};
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });

        const columnName = XLSX.utils.encode_col(C);
        if (columnName === 'A') continue;
        row[parcecColumpName(columnName)] =
          worksheet[cellAddress]?.w.toString() ?? '';
      }

      rawData.push(row);
    }
    return this.excelService.addManyClients(rawData);
  }

  @Get('export')
  async exportExcel(@Res() res: Response) {
    const data = [
      { Nombre: 'Juan', Edad: 30 },
      { Nombre: 'María', Edad: 25 },
      { Nombre: 'Carlos', Edad: 35 },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

    const excelBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=usuarios.xlsx');
    res.send(excelBuffer);
  }
}
type Column = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I';
function parcecColumpName(column: string): string {
  const correctKeyName = {
    A: 'id',
    B: 'name',
    C: 'lastName',
    D: 'sex',
    E: 'birthday',
    F: 'phone',
    G: 'email',
    H: 'notes',
    I: 'registration',
  };
  return correctKeyName[column as Column];
}
