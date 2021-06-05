// Require library
var xl = require('excel4node');
const debug = require('debug')('excel')
const moment = require('moment')
require('moment/locale/id')
moment.locale('id')

const boolToText = (boolData,type) => {
  // debug('boolData : %O',boolData)
  // debug('boolDataType : %O',typeof boolData)
  if(type !== 'report'){
  	if(!boolData){
    	return 'Belum tervalidasi'
	}else{
		return 'Sudah tervalidasi'
	}
  }
  if(type === 'report'){
  	if(typeof boolData === 'string'){
  		return boolData
  	}else if(boolData){
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
  ws.cell(1, 6, 1, 39, true).string('Laporan').style(blueFill);

  //report group
  //1
  ws.cell(2, 6, 2, 8, true).string('SMK3 di Fasyankes').style(redFill);

  ws.cell(3, 6).string('Ada komitmen/kebijakan').style(yellowFill);
  ws.column(6).setWidth(45)
  
  ws.cell(3, 7).string('Dokumen rencana kegiatan K3').style(purpleFill);
  ws.column(7).setWidth(45)

  ws.cell(3, 8).string('Ada Tim K3/Pengelola  K3').style(yellowFill);
  ws.column(8).setWidth(45)

  // 2
  ws.cell(2, 9, 2, 11, true).string('Pengenalan Potensi Bahaya dan Pengendalian Resiko').style(brownFill);

  ws.cell(3, 9).string('Identifikasi potensi bahaya').style(purpleFill);
  ws.column(9).setWidth(45)
  
  ws.cell(3, 10).string('Penilaian risiko').style(yellowFill);
  ws.column(10).setWidth(45)

  ws.cell(3, 11).string('Pengendalian risiko').style(purpleFill);
  ws.column(11).setWidth(45)

  // 3
  ws.cell(2, 12, 2, 15, true).string('Penerapan Kewaspadaan Standar').style(redFill);

  ws.cell(3, 12).string('Sarana dan Prasarana Kebersihan Tangan').style(yellowFill);
  ws.column(12).setWidth(45)

  ws.cell(3, 13).string('Penyediaan APD').style(purpleFill);
  ws.column(13).setWidth(45)

  ws.cell(3, 14).string('Pengelolaan jarun dan alat tajam').style(yellowFill);
  ws.column(14).setWidth(45)

  ws.cell(3, 15).string('Dekontaminasi peralatan').style(yellowFill);
  ws.column(15).setWidth(45)

  // 4
  ws.cell(2, 16, 2, 18, true).string('Penerapan Prinsip Ergonomi Pada').style(brownFill);

  ws.cell(3, 16).string('Angkat angkut pasien (pasien, barang, dan lain-lain), postur kerja').style(yellowFill); 
  ws.column(16).setWidth(45)

  ws.cell(3, 17).string('Pengaturan shift kerja').style(yellowFill);
  ws.column(17).setWidth(45)

  ws.cell(3, 18).string('Pengaturan Tata Ruang Kerja').style(yellowFill);
  ws.column(18).setWidth(45)

  // 5
  ws.cell(2, 19, 2, 21, true).string('Pelayanan Kesehatan Kerja dan Imunisasi').style(redFill);

  ws.cell(3, 19).string('Pemeriksaan kesehatan SDM  Fasyankes').style(yellowFill);
  ws.column(19).setWidth(45)

  ws.cell(3, 20).string('Fasyankes melakukan pemeriksaan kesehatan berkala').style(yellowFill);
  ws.column(20).setWidth(45)

  ws.cell(3, 21).string('Fasyankes melakukan imunisasi pada SDM Fasyankes yang beresiko').style(yellowFill);
  ws.column(21).setWidth(45)

  // 6
  ws.cell(2, 22, 2, 23, true).string('Pembudayaan PHBS di Fasyankes').style(brownFill);

  ws.cell(3, 22).string('Melakukan sosialisasi').style(yellowFill);
  ws.column(22).setWidth(45)

  ws.cell(3, 23).string('Media KIE').style(purpleFill);
  ws.column(23).setWidth(45)

  // 7
  ws.cell(2, 24, 2, 26, true).string('Aspek Keselamatan dan Kesehatan  Kerja  pada Pengelolaan Bahan Beracun dan Berbahaya (B3)  dan Limbah Domestik').style(redFill);

  ws.cell(3, 24).string('Daftar inventaris B3').style(yellowFill); 
  ws.column(24).setWidth(45)

  ws.cell(3, 25).string('SPO penggunaan B3').style(purpleFill);
  ws.column(25).setWidth(45)

  ws.cell(3, 26).string('Penyimpanan dan Pembuangan limbah B3 dan domestik sesuai persyaratan').style(yellowFill);
  ws.column(26).setWidth(45)
  
  // 8
  ws.cell(2, 27, 2, 30, true).string('Pengelolaan Sarana dan Prasarana dari Aspek K3').style(brownFill);

  ws.cell(3, 27).string('Pengukuran pencahayaan, kualitas air, kualitas udara').style(purpleFill);
  ws.column(27).setWidth(45)

  ws.cell(3, 28).string('Pemeliharaan Kebersihan Bangunan').style(yellowFill);
  ws.column(28).setWidth(45)

  ws.cell(3, 29).string('Ketersediaan air dan listrik').style(purpleFill);
  ws.column(29).setWidth(45)

  ws.cell(3, 30).string('Ketersediaan toilet sesuai standar').style(yellowFill);
  ws.column(30).setWidth(45)

  // 9
  ws.cell(2, 31).string('Pengelolaan Peralatan Medis Dari Aspek K3').style(redFill);

  ws.cell(3, 31).string('Pemeliharaan pada peralatan medis').style(purpleFill);
  ws.column(31).setWidth(45)

  // 10
  ws.cell(2, 32, 2, 37, true).string('Kesiapsiagaan menghadapi kondisi darurat/bencana ').style(brownFill);

  ws.cell(3, 32).string('SPO Penanganan Kondisi Darurat / Bencana').style(yellowFill);
  ws.column(32).setWidth(45)

  ws.cell(3, 33).string('Proteksi kebakaran').style(purpleFill);
  ws.column(33).setWidth(45)

  ws.cell(3, 34).string('Aktif ( Jumlah APAR dan alat pemadam lainnya)').style(yellowFill);
  ws.column(34).setWidth(45)

  ws.cell(3, 35).string('Pasif ( Pintu dan tangga darurat, jalur evakuasi)').style(purpleFill);
  ws.column(35).setWidth(45)

  ws.cell(3, 36).string('Darurat Bencana').style(yellowFill);
  ws.column(36).setWidth(45)

  ws.cell(3, 37).string('Penggunaan APAR').style(purpleFill);
  ws.column(37).setWidth(45)

  // 11
  ws.cell(2, 38, 2, 39, true).string('Pelatihan').style(redFill);

  ws.cell(3, 38).string('SDM Fasyankes terlatih K3').style(yellowFill);
  ws.column(38).setWidth(45)

  ws.cell(3, 39).string('Jumlah SDM Fasyankes yang terlatih K3').style(purpleFill);
  ws.column(39).setWidth(45)

  // Filling cell 
  const questionList = ['question1','question2','question3','question4','question5','question6','question7','question8','question9','question10','question11']

  const questionLengthOne = ['question9'] 
  const questionLengthTwo = ['question6','question11']
  const questionLengthThree = ['question1','question2','question4','question5','question7']
  const questionLengthFour = ['question3','question8']
  
  debug(reportYear.report[questionList[0]].a.information)
  let row = 4
  for(let _b = 0; _b < 1; _b++){
    let column = 6
    for(let _a = 0; _a < questionList.length; _a++){
      if(questionLengthTwo.indexOf(questionList[_a]) != -1){
        debug(questionList[_a])
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].a.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].b.information,reportType))
        column++
      }
      if(questionLengthOne.indexOf(questionList[_a]) != -1){
        debug(questionList[_a])
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].information,reportType))
        column++
      }
      if(questionLengthThree.indexOf(questionList[_a]) != -1){
        debug(questionList[_a])
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].a.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].b.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].c.information,reportType))
        column++
      }
      if(questionLengthFour.indexOf(questionList[_a]) != -1){
        debug(questionList[_a])
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].a.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].b.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].c.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].d.information,reportType))
        column++
      }
      if(questionList[_a] === 'question10'){
        debug(questionList[_a])
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].a.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].b.a.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].b.b.information, reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].b.c.information, reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].c.a.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear.report[questionList[_a]].c.b.information,reportType))
        column++
        }
      }
      row++
    }
  
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

  //DATA INSERT
  
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

const reportsYearHeader = (reportYear, res) =>{
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
  ws.cell(1, 6, 1, 39, true).string('Laporan').style(blueFill);

  //report group
  //1
  ws.cell(2, 6, 2, 8, true).string('SMK3 di Fasyankes').style(redFill);

  ws.cell(3, 6).string('Ada komitmen/kebijakan').style(yellowFill);
  ws.column(6).setWidth(45)
  
  ws.cell(3, 7).string('Dokumen rencana kegiatan K3').style(purpleFill);
  ws.column(7).setWidth(45)

  ws.cell(3, 8).string('Ada Tim K3/Pengelola  K3').style(yellowFill);
  ws.column(8).setWidth(45)

  // 2
  ws.cell(2, 9, 2, 11, true).string('Pengenalan Potensi Bahaya dan Pengendalian Resiko').style(brownFill);

  ws.cell(3, 9).string('Identifikasi potensi bahaya').style(purpleFill);
  ws.column(9).setWidth(45)
  
  ws.cell(3, 10).string('Penilaian risiko').style(yellowFill);
  ws.column(10).setWidth(45)

  ws.cell(3, 11).string('Pengendalian risiko').style(purpleFill);
  ws.column(11).setWidth(45)

  // 3
  ws.cell(2, 12, 2, 15, true).string('Penerapan Kewaspadaan Standar').style(redFill);

  ws.cell(3, 12).string('Sarana dan Prasarana Kebersihan Tangan').style(yellowFill);
  ws.column(12).setWidth(45)

  ws.cell(3, 13).string('Penyediaan APD').style(purpleFill);
  ws.column(13).setWidth(45)

  ws.cell(3, 14).string('Pengelolaan jarun dan alat tajam').style(yellowFill);
  ws.column(14).setWidth(45)

  ws.cell(3, 15).string('Dekontaminasi peralatan').style(yellowFill);
  ws.column(15).setWidth(45)

  // 4
  ws.cell(2, 16, 2, 18, true).string('Penerapan Prinsip Ergonomi Pada').style(brownFill);

  ws.cell(3, 16).string('Angkat angkut pasien (pasien, barang, dan lain-lain), postur kerja').style(yellowFill); 
  ws.column(16).setWidth(45)

  ws.cell(3, 17).string('Pengaturan shift kerja').style(yellowFill);
  ws.column(17).setWidth(45)

  ws.cell(3, 18).string('Pengaturan Tata Ruang Kerja').style(yellowFill);
  ws.column(18).setWidth(45)

  // 5
  ws.cell(2, 19, 2, 21, true).string('Pelayanan Kesehatan Kerja dan Imunisasi').style(redFill);

  ws.cell(3, 19).string('Pemeriksaan kesehatan SDM  Fasyankes').style(yellowFill);
  ws.column(19).setWidth(45)

  ws.cell(3, 20).string('Fasyankes melakukan pemeriksaan kesehatan berkala').style(yellowFill);
  ws.column(20).setWidth(45)

  ws.cell(3, 21).string('Fasyankes melakukan imunisasi pada SDM Fasyankes yang beresiko').style(yellowFill);
  ws.column(21).setWidth(45)

  // 6
  ws.cell(2, 22, 2, 23, true).string('Pembudayaan PHBS di Fasyankes').style(brownFill);

  ws.cell(3, 22).string('Melakukan sosialisasi').style(yellowFill);
  ws.column(22).setWidth(45)

  ws.cell(3, 23).string('Media KIE').style(purpleFill);
  ws.column(23).setWidth(45)

  // 7
  ws.cell(2, 24, 2, 26, true).string('Aspek Keselamatan dan Kesehatan  Kerja  pada Pengelolaan Bahan Beracun dan Berbahaya (B3)  dan Limbah Domestik').style(redFill);

  ws.cell(3, 24).string('Daftar inventaris B3').style(yellowFill); 
  ws.column(24).setWidth(45)

  ws.cell(3, 25).string('SPO penggunaan B3').style(purpleFill);
  ws.column(25).setWidth(45)

  ws.cell(3, 26).string('Penyimpanan dan Pembuangan limbah B3 dan domestik sesuai persyaratan').style(yellowFill);
  ws.column(26).setWidth(45)
  
  // 8
  ws.cell(2, 27, 2, 30, true).string('Pengelolaan Sarana dan Prasarana dari Aspek K3').style(brownFill);

  ws.cell(3, 27).string('Pengukuran pencahayaan, kualitas air, kualitas udara').style(purpleFill);
  ws.column(27).setWidth(45)

  ws.cell(3, 28).string('Pemeliharaan Kebersihan Bangunan').style(yellowFill);
  ws.column(28).setWidth(45)

  ws.cell(3, 29).string('Ketersediaan air dan listrik').style(purpleFill);
  ws.column(29).setWidth(45)

  ws.cell(3, 30).string('Ketersediaan toilet sesuai standar').style(yellowFill);
  ws.column(30).setWidth(45)

  // 9
  ws.cell(2, 31).string('Pengelolaan Peralatan Medis Dari Aspek K3').style(redFill);

  ws.cell(3, 31).string('Pemeliharaan pada peralatan medis').style(purpleFill);
  ws.column(31).setWidth(45)

  // 10
  ws.cell(2, 32, 2, 37, true).string('Kesiapsiagaan menghadapi kondisi darurat/bencana ').style(brownFill);

  ws.cell(3, 32).string('SPO Penanganan Kondisi Darurat / Bencana').style(yellowFill);
  ws.column(32).setWidth(45)

  ws.cell(3, 33).string('Proteksi kebakaran').style(purpleFill);
  ws.column(33).setWidth(45)

  ws.cell(3, 34).string('Aktif ( Jumlah APAR dan alat pemadam lainnya)').style(yellowFill);
  ws.column(34).setWidth(45)

  ws.cell(3, 35).string('Pasif ( Pintu dan tangga darurat, jalur evakuasi)').style(purpleFill);
  ws.column(35).setWidth(45)

  ws.cell(3, 36).string('Darurat Bencana').style(yellowFill);
  ws.column(36).setWidth(45)

  ws.cell(3, 37).string('Penggunaan APAR').style(purpleFill);
  ws.column(37).setWidth(45)

  // 11
  ws.cell(2, 38, 2, 39, true).string('Pelatihan').style(redFill);

  ws.cell(3, 38).string('SDM Fasyankes terlatih K3').style(yellowFill);
  ws.column(38).setWidth(45)

  ws.cell(3, 39).string('Jumlah SDM Fasyankes yang terlatih K3').style(purpleFill);
  ws.column(39).setWidth(45)

  return [ws,wb]
}

exports.exportAll = (reportYear, res, length) => {
  const reportType = 'report'
  const [ws,wb] = reportsYearHeader(reportYear, res)
  const questionList = ['question1','question2','question3','question4','question5','question6','question7','question8','question9','question10','question11']

  const questionLengthOne = ['question9'] 
  const questionLengthTwo = ['question6','question11']
  const questionLengthThree = ['question1','question2','question4','question5','question7']
  const questionLengthFour = ['question3','question8']

  //Filling data
  let row = 4
  debug('Array length : %O',length)

  for(let _b = 0; _b < length; _b++){
    // author
    ws.cell(row, 1).string(reportYear[_b].author.full_name)
    ws.column(1).setWidth(50)

    // date
    ws.cell(row, 2).string(moment(reportYear[_b].year).format('YYYY'))
    ws.column(2).setWidth(20)

    // validated
    ws.cell(row, 3).string(boolToText(reportYear[_b].validated))
    ws.column(3).setWidth(25)

    // institution
    ws.cell(row, 4).string(reportYear[_b].institution.name)
    ws.column(4).setWidth(45)

    // jumlah sdm
    ws.cell(row, 5).number(reportYear[_b].totalSDM)
    ws.column(5).setWidth(45)
    debug('Row : %O',row)
    let column = 6
    for(let _a = 0; _a < questionList.length; _a++){
      // debug('Column : %O', column)
      // debug(reportYear)
      // debug(questionList[_a])
      if(questionLengthTwo.indexOf(questionList[_a]) != -1){
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].a.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].b.information,reportType))
        column++
      }
      if(questionLengthOne.indexOf(questionList[_a]) != -1){

        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].information,reportType))
        column++
      }
      if(questionLengthThree.indexOf(questionList[_a]) != -1){

        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].a.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].b.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].c.information,reportType))
        column++
      }
      if(questionLengthFour.indexOf(questionList[_a]) != -1){

        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].a.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].b.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].c.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].d.information,reportType))
        column++
      }
      if(questionList[_a] === 'question10'){

        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].a.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].b.a.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].b.b.information, reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].b.c.information, reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].c.a.information,reportType))
        column++
        // debug(row)
        ws.cell(row,column).string(boolToText(reportYear[_b].report[questionList[_a]].c.b.information,reportType))
        column++
        }
      }
  row++
  }
  
  wb.write('Excel.xlsx',res)
}