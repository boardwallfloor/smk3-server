// Require library
var xl = require('excel4node');
const debug = require('debug')('excel')
const moment = require('moment')
require('moment/locale/id')
moment.locale('id')

const boolToText = (boolData,type) => {
  debug(typeof boolData)

  if(type !== 'report'){
  	if(!boolData){
    	return 'Belum tervalidasi'
	}else{
		return 'Sudah tervalidasi'
	}
  }
  if(type === 'report'){
  	if(boolData){
  		return 'Ada'
  	}else{
  		return 'Tidak ada'
  	}
  }
}

const undefinedToEmptySpace = (data) => {
  if(data === undefined){
    return ''
  }
  return data
}

const generateExcelFile = (data) => {
  debug(data)
  debug('Create a new instance of a Workbook class')
  var wb = new 
  xl.Workbook();

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
      size: 14,

    },
    alignment: {
      horizontal: ['center'],
      vertical: ['center']
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
      size: 14,

    },
    alignment: {
      horizontal: ['center'],
      vertical: ['center']
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
  var purpleFill = wb.createStyle({
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
        fgColor: '#BF2380' 
    }
  });
  var brownFill = wb.createStyle({
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
        fgColor: '#BE9224' 
    }
  });

  return [wb, ws, greenFill, yellowFill, redFill, blueFill, purpleFill, brownFill]
}

exports.reportYearToExcel = (reportYear, res) => {
  const [wb, ws, greenFill, yellowFill, redFill, blueFill, purpleFill, brownFill] = generateExcelFile(reportYear)
  const reportType = 'report'
  // author
  ws.cell(1, 1, 3, 1, true).string('Nama Operator').style(greenFill);
  ws.column(1).setWidth(50)
  // date
  ws.cell(1, 2, 3, 2, true).string('Tanggal').style(blueFill);
  ws.column(2).setWidth(20)

  // validated
  ws.cell(1, 3, 3, 3, true).string('Status Validasi').style(greenFill);
  ws.column(3).setWidth(25)

  // institution
  ws.cell(1, 4, 3, 4, true).string('Fasyankes').style(blueFill);
  ws.column(4).setWidth(45)

  // jumlah sdm
  ws.cell(1, 5, 3, 5, true).string('Jumlah SDM').style(greenFill);
  ws.column(5).setWidth(45)

  // report
  ws.cell(1, 6, 1, 38, true).string('Laporan').style(blueFill);

  //report group
  //1
  ws.cell(2, 6, 2, 8, true).string('SMK3 di Fasyankes').style(redFill);
  ws.cell(3, 6).string('Ada komitmen/kebijakan').style(yellowFill);
  ws.cell(4, 6).string(boolToText(reportYear.report.question1.a.information, reportType))
  ws.column(6).setWidth(45)
  ws.cell(3, 7).string('Dokumen rencana kegiatan K3').style(purpleFill);
  ws.cell(4, 7).string(boolToText(reportYear.report.question1.b.information, reportType))
  ws.column(7).setWidth(45)
  ws.cell(3, 8).string('Ada Tim K3/Pengelola  K3').style(yellowFill);
  ws.cell(4, 8).string(boolToText(reportYear.report.question1.c.information, reportType))
  ws.column(8).setWidth(45)
  // 2
  ws.cell(2, 9, 2, 10, true).string('Pengenalan Potensi Bahaya dan Pengendalian Resiko').style(brownFill);
  ws.cell(3, 9).string('Identifikasi potensi bahaya').style(purpleFill);
  ws.cell(4, 9).string(boolToText(reportYear.report.question2.a.information, reportType))
  ws.column(9).setWidth(45)
  ws.cell(3, 10).string('Penilaian risiko').style(yellowFill);
  ws.cell(4, 10).string(boolToText(reportYear.report.question2.c.information, reportType))
  ws.column(10).setWidth(45)
  // 3
  ws.cell(2, 11, 2, 14, true).string('Penerapan Kewaspadaan Standar').style(redFill);
  ws.cell(3, 11).string('Sarana dan Prasarana Kebersihan Tangan').style(purpleFill);
  ws.cell(4, 11).string(boolToText(reportYear.report.question3.a.information, reportType))
  ws.column(11).setWidth(45)
  ws.cell(3, 12).string('Penyediaan APD').style(yellowFill);
  ws.cell(4, 12).string(boolToText(reportYear.report.question3.b.information, reportType))
  ws.column(12).setWidth(45)
  ws.cell(3, 13).string('Pengelolaan jarun dan alat tajam').style(purpleFill);
  ws.cell(4, 13).string(boolToText(reportYear.report.question3.c.information, reportType))
  ws.column(13).setWidth(45)
  ws.cell(3, 14).string('Dekontaminasi peralatan').style(yellowFill);
  ws.cell(4, 14).string(boolToText(reportYear.report.question3.d.information, reportType))
  ws.column(14).setWidth(45)

  // 4
  ws.cell(2, 15, 2, 17, true).string('Penerapan Prinsip Ergonomi Pada').style(brownFill);
  ws.cell(3, 15).string('Angkat angkut pasien (pasien, barang, dan lain-lain), postur kerja').style(purpleFill);
  ws.cell(4, 15).string(boolToText(reportYear.report.question4.a.information, reportType))
  ws.column(15).setWidth(45)
  ws.cell(3, 16).string('Pengaturan shift kerja').style(yellowFill);
  ws.cell(4, 16).string(boolToText(reportYear.report.question4.b.information, reportType))
  ws.column(16).setWidth(45)
  ws.cell(3, 17).string('Pengaturan Tata Ruang Kerja').style(purpleFill);
  ws.cell(4, 17).string(boolToText(reportYear.report.question4.c.information, reportType))
  ws.column(17).setWidth(45)

  // 5
  ws.cell(2, 18, 2, 20, true).string('Pelayanan Kesehatan Kerja dan Imunisasi').style(redFill);
  ws.cell(3, 18).string('Pemeriksaan kesehatan SDM  Fasyankes').style(yellowFill);
  ws.cell(4, 18).string(boolToText(reportYear.report.question5.a.information, reportType))
  ws.column(18).setWidth(45)
  ws.cell(3, 19).string('Fasyankes melakukan pemeriksaan kesehatan berkala').style(purpleFill);
  ws.cell(4, 19).string(boolToText(reportYear.report.question5.b.information, reportType))
  ws.column(19).setWidth(45)
  ws.cell(3, 20).string('Fasyankes melakukan imunisasi pada SDM Fasyankes yang beresiko').style(yellowFill);
  ws.cell(4, 20).string(boolToText(reportYear.report.question5.c.information, reportType))
  ws.column(20).setWidth(45)

  // 6
  ws.cell(2, 21, 2, 22, true).string('Pembudayaan PHBS di Fasyankes').style(brownFill);
  ws.cell(3, 21).string('Melakukan sosialisasi').style(purpleFill);
  ws.cell(4, 21).string(boolToText(reportYear.report.question6.a.information, reportType))
  ws.column(21).setWidth(45)
  ws.cell(3, 22).string('Media KIE').style(yellowFill);
  ws.cell(4, 22).string(boolToText(reportYear.report.question6.b.information, reportType))
  ws.column(22).setWidth(45)

  // 7
  ws.cell(2, 23, 2, 25, true).string('Aspek Keselamatan dan Kesehatan  Kerja  pada Pengelolaan Bahan Beracun dan Berbahaya (B3)  dan Limbah Domestik').style(redFill);
  ws.cell(3, 23).string('Daftar inventaris B3').style(purpleFill);
  ws.cell(4, 23).string(boolToText(reportYear.report.question7.a.information, reportType))
  ws.column(23).setWidth(45)
  ws.cell(3, 24).string('SPO penggunaan B3').style(yellowFill);
  ws.cell(4, 24).string(boolToText(reportYear.report.question7.b.information, reportType))
  ws.column(24).setWidth(45)
  ws.cell(3, 25).string('Penyimpanan dan Pembuangan limbah B3 dan domestik sesuai persyaratan').style(purpleFill);
  ws.cell(4, 25).string(boolToText(reportYear.report.question7.c.information, reportType))
  ws.column(25).setWidth(45)
  
  // 8
  ws.cell(2, 26, 2, 29, true).string('Pengelolaan Sarana dan Prasarana dari Aspek K3').style(brownFill);
  ws.cell(3, 26).string('Pengukuran pencahayaan, kualitas air, kualitas udara').style(yellowFill);
  ws.cell(4, 26).string(boolToText(reportYear.report.question8.a.information, reportType))
  ws.column(26).setWidth(45)
  ws.cell(3, 27).string('Pemeliharaan Kebersihan Bangunan').style(purpleFill);
  ws.cell(4, 27).string(boolToText(reportYear.report.question8.b.information, reportType))
  ws.column(27).setWidth(45)
  ws.cell(3, 28).string('Ketersediaan air dan listrik').style(yellowFill);
  ws.cell(4, 28).string(boolToText(reportYear.report.question8.c.information, reportType))
  ws.column(28).setWidth(45)
  ws.cell(3, 29).string('Ketersediaan toilet sesuai standar').style(purpleFill);
  ws.cell(4, 29).string(boolToText(reportYear.report.question8.d.information, reportType))
  ws.column(29).setWidth(45)

  // 9
  ws.cell(2, 30).string('Pengelolaan Peralatan Medis Dari Aspek K3').style(redFill);
  ws.cell(3, 30).string('Pemeliharaan pada peralatan medis').style(yellowFill);
  ws.cell(4, 30).string(boolToText(reportYear.report.question9.information, reportType))
  ws.column(30).setWidth(45)

  // 10
  ws.cell(2, 31, 2, 36, true).string('Kesiapsiagaan menghadapi kondisi darurat/bencana ').style(brownFill);
  ws.cell(3, 31).string('SPO Penanganan Kondisi Darurat / Bencana').style(purpleFill);
  ws.cell(4, 31).string(boolToText(reportYear.report.question10.a.information, reportType))
  ws.column(31).setWidth(45)
  ws.cell(3, 32).string('Proteksi kebakaran').style(yellowFill);
  ws.cell(4, 32).string(boolToText(reportYear.report.question10.b.a.information, reportType))
  ws.column(32).setWidth(45)
  ws.cell(3, 33).string('Aktif ( Jumlah APAR dan alat pemadam lainnya)').style(purpleFill);
  ws.cell(4, 33).string(reportYear.report.question10.b.b.information)
  ws.column(33).setWidth(45)
  ws.cell(3, 34).string('Pasif ( Pintu dan tangga darurat, jalur evakuasi)').style(yellowFill);
  ws.cell(4, 34).string(reportYear.report.question10.b.c.information)
  ws.column(34).setWidth(45)
  ws.cell(3, 35).string('Darurat Bencana').style(purpleFill);
  ws.cell(4, 35).string(boolToText(reportYear.report.question10.c.a.information, reportType))
  ws.column(35).setWidth(45)
  ws.cell(3, 36).string('Penggunaan APAR').style(yellowFill);
  ws.cell(4, 36).string(boolToText(reportYear.report.question10.c.b.information, reportType))
  ws.column(36).setWidth(45)

  // 11
  ws.cell(2, 37, 2, 38, true).string('Pelatihan').style(redFill);
  ws.cell(3, 37).string('SDM Fasyankes terlatih K3').style(purpleFill);
  ws.cell(4, 37).string(boolToText(reportYear.report.question11.a.information, reportType))
  ws.column(37).setWidth(45)
  ws.cell(3, 38).string('Jumlah SDM Fasyankes yang terlatih K3').style(yellowFill);
  ws.cell(4, 38).string(boolToText(reportYear.report.question11.b.information, reportType))
  ws.column(38).setWidth(45)

  // Filling cell 
  // author
  ws.cell(4, 1).string(reportYear.author.full_name)
  ws.column(1).setWidth(50)
  // date
  ws.cell(4, 2).string(moment(reportYear.year).format('YYYY'))
  ws.column(2).setWidth(20)

  // validated
  ws.cell(4, 3).string(boolToText(reportYear.validated))
  ws.column(3).setWidth(25)

  // institution
  ws.cell(4, 4).string(reportYear.institution.name)
  ws.column(4).setWidth(45)

  // jumlah sdm
  ws.cell(4, 5).number(reportYear.totalSDM)
  ws.column(5).setWidth(45)



  wb.write('Excel.xlsx',res);
}

exports.reportSemesterToExcel = (reportSemester, res) => {
  
  const [wb, ws, greenFill, yellowFill, redFill,blueFill] = generateExcelFile(reportSemester)

  ws.cell(1, 1, 2, 1, true).string('Nama Operator').style(greenFill);
  ws.column(1).setWidth(50)
  // date
  ws.cell(1, 2, 2, 2, true).string('Tanggal').style(blueFill);
  ws.column(2).setWidth(20)

  // validated
  ws.cell(1, 3, 2, 3, true).string('Status Validasi').style(greenFill);
  ws.column(3).setWidth(25)

  // institution
  ws.cell(1, 4, 2, 4, true).string('Fasyankes').style(blueFill);
  ws.column(4).setWidth(45)

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

  //Fill the cell with data
  
  // Author input
  ws.cell(3, 1).string(reportSemester.author.full_name)
  // Date input
  ws.cell(3, 2).string(moment(reportSemester.date).format('LL'))
  // Author input
  ws.cell(3, 3).string(boolToText(reportSemester.validated))
  // Fasyankes input
  ws.cell(3, 4).string(reportSemester.institution.name)

  // report group
  const questionList = ['question1','question2','question3','question4','question5','question6','question7','question8']
  for(let _a = 0; _a < questionList.length; _a++){
    const calc = 5 + (_a * 2);
    ws.cell(3, calc).number(reportSemester.report[questionList[_a]].total)
    ws.cell(3, calc+1).string(undefinedToEmptySpace(reportSemester.report[questionList[_a]].detail))
  }

  debug('Generate File')

 
  wb.write('Excel.xlsx',res);
}