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
    range.s.r = 1; // La primera fila es 0

    const rawData = [];
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const row = {};
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });

        const columnName = XLSX.utils.encode_col(C);
        if (columnName === 'A') continue;
        if (columnName === 'F') continue;
        if (columnName === 'H') continue;
        if (columnName === 'J') continue;
        if (columnName === 'K') continue;
        if (columnName === 'L') continue;
        if (columnName === 'M') continue;
        row[parcecColumpName(columnName)] =
          worksheet[cellAddress]?.w.toString() ?? '';
      }

      rawData.push(row);
    }

    return this.excelService.addManyClients(rawData);
  }

  @Get('export')
  async exportExcel(@Res() res: Response) {
    const data = await this.excelService.getClients();

    const correctData = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      firstLastName: item.firstLastName,
      secondLastName: item.secondLastName,
      birthday: item.birthday,
      phone: item.phone,
      email: item.email,
    }));

    const Heading = [
      [
        'Nº Cliente',
        'Nombre',
        'Primer apellido',
        'Segundo apellido',
        'Fecha nacimiento',
        'Teléfono',
        'Email',
      ],
    ];

    // const worksheet = XLSX.utils.json_to_sheet(translatedData);
    const worksheet = XLSX.utils.json_to_sheet(correctData, {
      origin: 'A2',
      skipHeader: true,
    });

    XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });

    // Calcular el ancho máximo de cada columna
    const columnWidths = [];
    correctData.forEach((row) => {
      Object.keys(row).forEach((key, index) => {
        const cellLength = row[key].toString().length;
        columnWidths[index] = columnWidths[index] || 0;
        if (cellLength > columnWidths[index]) {
          columnWidths[index] = cellLength;
        }
      });
    });

    // Establecer el ancho de las columnas
    worksheet['!cols'] = columnWidths.map((width) => ({ wch: width }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pacientes');

    const excelBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
      compression: true,
    });

    // Cambiar los encabezados de respuesta
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=pacientes.xlsx');
    res.send(excelBuffer);
  }
}
type Column = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I';
function parcecColumpName(column: string): string {
  const correctKeyName = {
    A: 'id',
    B: 'name',
    C: 'firstLastName',
    D: 'secondLastName',
    E: 'email',
    F: 'phone',
    G: 'birthday',
    I: 'phone',
  };
  return correctKeyName[column as Column];
}
