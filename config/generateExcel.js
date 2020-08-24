// Require library
var xl = require('excel4node');
const debug = require('debug')('excel')

exports.generateExcelFile = async (data,res) => {
  debug(data)
  debug('Create a new instance of a Workbook class')
  var wb = new xl.Workbook();

  var options = {
  margins: {
    left: 1.5,
    right: 1.5,
  },
};

  debug('Add Worksheets to the workbook')
  var ws = wb.addWorksheet('Sheet1',options);

  debug('Create a reusable style')
  var greenFill = wb.createStyle({
    font: {
      color: '#000000',
      bold: true,
      name: 'Calibri',
      size: 12,

    },
    alignment: {
      horizontal: ['center']
    },
    fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#69B050' 
    }
  });
  var blueFill = wb.createStyle({
    font: {
      color: '#000000',
      bold: true,
      name: 'Calibri',
      size: 12,

    },
    alignment: {
      horizontal: ['center']
    },
    fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#565CC0' 
    }
  });
  var redFill = wb.createStyle({
    font: {
      color: '#000000',
      bold: true,
      name: 'Calibri',
      size: 12,

    },
    alignment: {
      horizontal: ['center']
    },
    fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#D82525' 
    }
  });
  var yellowFill = wb.createStyle({
    font: {
      color: '#000000',
      bold: true,
      name: 'Calibri',
      size: 12,

    },
    alignment: {
      horizontal: ['center']
    },
    fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#FFFC00' 
    }
  });

  //(baris, kolom)
  // author
  ws.cell(1, 1, 2, 1, true).string('Nama Operator').style(greenFill);
  ws.column(1).setWidth(50)
  // date
  ws.cell(1, 2, 2, 2, true).string('Tanggal').style(blueFill);

  // validated
  ws.cell(1, 3, 2, 3, true).string('Fasyankes').style(greenFill);

  // institution
  ws.cell(1, 4, 2, 4, true).string('Total').style(blueFill);
  //report
  ws.cell(1, 5, 1, 20, true).string('Laporan').style(greenFill);

  ws.cell(2, 5).string('Jumlah SDM Fasyankes').style(redFill)
  ws.cell(2, 6).string('Keterangan').style(yellowFill)
  ws.column(5).setWidth(45)

  ws.cell(2, 7).string('Jumlah SDM Fasyankes yang sakit').style(redFill)
  ws.cell(2, 8).string('Keterangan').style(yellowFill)
  ws.column(7).setWidth(45)

  ws.cell(2, 9).string('Jumlah SDM yang sakit').style(redFill)
  ws.cell(2, 10).string('Keterangan').style(yellowFill)
  ws.column(9).setWidth(45)

  ws.cell(2, 11).string('Jumlah kasus dugaan penyakit akibat kerja pada suatu SDM Fasyankes').style(redFill)
  ws.cell(2, 12).string('Keterangan').style(yellowFill)
  ws.column(11).setWidth(70)

  ws.cell(2, 13).string('Jumlah kasus penyakit akibat kerja pada SDM Fasyankes').style(redFill)
  ws.cell(2, 14).string('Keterangan').style(yellowFill)
  ws.column(13).setWidth(65)

  ws.cell(2, 15).string('Jumlah kasus kecelakaan akibat kerja pada SDM Fasyankes').style(redFill)
  ws.cell(2, 16).string('Keterangan').style(yellowFill)
  ws.column(15).setWidth(65)

  ws.cell(2, 17).string('Jumlah kasus kejadian hampir celaka pada SDM Fasyankes').style(redFill)
  ws.cell(2, 18).string('Keterangan').style(yellowFill)
  ws.column(17).setWidth(65)

  ws.cell(2, 19).string('Jumlah hari absen SDM Fasyankes karena sakit').style(redFill)
  ws.cell(2, 20).string('Keterangan').style(yellowFill)
  ws.column(19).setWidth(55)
  // // Strudent 1 marks details
  // ws.cell(2, 1).number(1)
  // ws.cell(2, 2).string('Mahesh')
  // ws.cell(2, 3).number(56)
  // ws.cell(2, 4).number(89)
  // ws.cell(2, 5).formula('C2 + D2')

  // // Strudent 2 marks details
  // ws.cell(3, 1).number(2)
  // ws.cell(3, 2).string('Abbas Ali')
  // ws.cell(3, 3).number(70)
  // ws.cell(3, 4).number(90)
  // ws.cell(3, 5).formula('C3 + D3')

  debug('Generate File')

  // let date_ob = new Date();
  // let hours = date_ob.getHours();
  // let minutes = date_ob.getMinutes();
  // let seconds = date_ob.getSeconds();
  // let date = date_ob.getDate();
  // let month = date_ob.getMonth() + 1;
  // let year = date_ob.getFullYear();

  // prints date & time in YYYY-MM-DD format
  // debug(year + "-" + month + "-" + date + " " +hours+':'+minutes+":"+seconds)
  // const currentDate= year + "-" + month + "-" + date + " " +hours+':'+minutes+":"+seconds
  // const filePath = `tmp/Excel - ${currentDate}.xlsx`
  // debug(filePath)
  await wb.write('Excel.xlsx',res);
  // await wb.write(filePath);
  // debug(filePath)
  // return filePath;
}