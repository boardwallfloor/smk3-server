var xl = require('excel4node');
const debug = require('debug')('excelLayout')

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

exports.reportsYearHeader = (reportYear, res) =>{
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

exports.reportsSemesterHeader = (reportSemester, res) => {
  
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

  return [ws, wb]

}