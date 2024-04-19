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
} from '@nestjs/common';
import { lstat } from 'fs';

@Controller('excel')
export class ExcelController {
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file) {
    const workbook = XLSX.read(file.buffer);
    const sheetName = workbook.SheetNames[0]; // Suponiendo que solo hay una hoja en el archivo Excel
    const sheet = workbook.Sheets[sheetName];
    // Obtener el rango completo de la hoja de cálculo
    const range = XLSX.utils.decode_range(sheet['!ref']);

    // Ajustar el rango para comenzar desde la fila 5
    range.s.r = 4; // La primera fila es 0

    // Convertir el rango de celdas en JSON
    const rawData = XLSX.utils.sheet_to_json(sheet, { range });
    // Mapear los nombres de las claves en el JSON
    const mappedData = rawData.map((item: any) => ({
      id: item['Nº Cliente'],
      name: item['Nombre'],
      lastName: item['Primer apellido'],
      sex: item['Sexo'],
      birthday: item['Fecha nacimiento'],
      phone: item['Teléfono'],
      email: item['E-mail'],
      notes: item['Notas'],
    }));

    // Aquí puedes manejar los datos importados, por ejemplo, guardarlos en la base de datos o procesarlos de alguna otra manera
    console.log('Datos importados:', mappedData);

    return { message: 'Datos importados correctamente' };
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
