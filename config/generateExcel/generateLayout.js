const xl = require('excel4node')
const debug = require('debug')('excelLayout')
const ExcelJS = require('exceljs')

const generateExcelFile = (data) => {
  debug(data)
  debug('Create a new instance of a Workbook class')
  const wb = new
  xl.Workbook()

  const options = {
    margins: {
      left: 1.5,
      right: 1.5
    }
  }

  debug('Add Worksheets to the workbook')
  const ws = wb.addWorksheet('Sheet1', options)

  debug('Create a reusable style')
  const greenFill = wb.createStyle({
    font: {
      color: '#000000',
      bold: true,
      name: 'Calibri',
      size: 14

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
  })
  const blueFill = wb.createStyle({
    font: {
      color: '#000000',
      bold: true,
      name: 'Calibri',
      size: 14

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
  })
  const redFill = wb.createStyle({
    font: {
      color: '#000000',
      bold: true,
      name: 'Calibri',
      size: 12

    },
    alignment: {
      horizontal: ['center']
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: '#D82525'
    }
  })
  const yellowFill = wb.createStyle({
    font: {
      color: '#000000',
      bold: true,
      name: 'Calibri',
      size: 12

    },
    alignment: {
      horizontal: ['center']
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: '#FFFC00'
    }
  })
  const purpleFill = wb.createStyle({
    font: {
      color: '#000000',
      bold: true,
      name: 'Calibri',
      size: 12

    },
    alignment: {
      horizontal: ['center']
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: '#BF2380'
    }
  })
  const brownFill = wb.createStyle({
    font: {
      color: '#000000',
      bold: true,
      name: 'Calibri',
      size: 12

    },
    alignment: {
      horizontal: ['center']
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: '#BE9224'
    }
  })

  return [wb, ws, greenFill, yellowFill, redFill, blueFill, purpleFill, brownFill]
}

exports.reportsYearHeader = (reportYear, res) => {
  const [wb, ws, greenFill, yellowFill, redFill, blueFill, purpleFill, brownFill] = generateExcelFile(reportYear)
  const reportType = 'report'
  // author
  ws.cell(1, 1, 3, 1, true).string('Nama Operator').style(greenFill)
  ws.column(1).setWidth(50)
  // date
  ws.cell(1, 2, 3, 2, true).string('Tanggal').style(blueFill)
  ws.column(2).setWidth(20)

  // validated
  ws.cell(1, 3, 3, 3, true).string('Status Validasi').style(greenFill)
  ws.column(3).setWidth(25)

  // institution
  ws.cell(1, 4, 3, 4, true).string('Fasyankes').style(blueFill)
  ws.column(4).setWidth(45)

  // jumlah sdm
  ws.cell(1, 5, 3, 5, true).string('Jumlah SDM').style(greenFill)
  ws.column(5).setWidth(45)

  // report
  ws.cell(1, 6, 1, 39, true).string('Laporan').style(blueFill)

  // report group
  // 1
  ws.cell(2, 6, 2, 8, true).string('SMK3 di Fasyankes').style(redFill)

  ws.cell(3, 6).string('Ada komitmen/kebijakan').style(yellowFill)
  ws.column(6).setWidth(20)

  ws.cell(3, 7).string('Dokumen rencana kegiatan K3').style(purpleFill)
  ws.column(7).setWidth(20)

  ws.cell(3, 8).string('Ada Tim K3/Pengelola  K3').style(yellowFill)
  ws.column(8).setWidth(20)

  // 2
  ws.cell(2, 9, 2, 11, true).string('Pengenalan Potensi Bahaya dan Pengendalian Resiko').style(brownFill)

  ws.cell(3, 9).string('Identifikasi potensi bahaya').style(purpleFill)
  ws.column(9).setWidth(20)

  ws.cell(3, 10).string('Penilaian risiko').style(yellowFill)
  ws.column(10).setWidth(20)

  ws.cell(3, 11).string('Pengendalian risiko').style(purpleFill)
  ws.column(11).setWidth(20)

  // 3
  ws.cell(2, 12, 2, 15, true).string('Penerapan Kewaspadaan Standar').style(redFill)

  ws.cell(3, 12).string('Sarana dan Prasarana Kebersihan Tangan').style(yellowFill)
  ws.column(12).setWidth(20)

  ws.cell(3, 13).string('Penyediaan APD').style(purpleFill)
  ws.column(13).setWidth(20)

  ws.cell(3, 14).string('Pengelolaan jarun dan alat tajam').style(yellowFill)
  ws.column(14).setWidth(20)

  ws.cell(3, 15).string('Dekontaminasi peralatan').style(yellowFill)
  ws.column(15).setWidth(20)

  // 4
  ws.cell(2, 16, 2, 18, true).string('Penerapan Prinsip Ergonomi Pada').style(brownFill)

  ws.cell(3, 16).string('Angkat angkut pasien (pasien, barang, dan lain-lain), postur kerja').style(yellowFill)
  ws.column(16).setWidth(20)

  ws.cell(3, 17).string('Pengaturan shift kerja').style(yellowFill)
  ws.column(17).setWidth(20)

  ws.cell(3, 18).string('Pengaturan Tata Ruang Kerja').style(yellowFill)
  ws.column(18).setWidth(20)

  // 5
  ws.cell(2, 19, 2, 21, true).string('Pelayanan Kesehatan Kerja dan Imunisasi').style(redFill)

  ws.cell(3, 19).string('Pemeriksaan kesehatan SDM  Fasyankes').style(yellowFill)
  ws.column(19).setWidth(20)

  ws.cell(3, 20).string('Fasyankes melakukan pemeriksaan kesehatan berkala').style(yellowFill)
  ws.column(20).setWidth(20)

  ws.cell(3, 21).string('Fasyankes melakukan imunisasi pada SDM Fasyankes yang beresiko').style(yellowFill)
  ws.column(21).setWidth(20)

  // 6
  ws.cell(2, 22, 2, 23, true).string('Pembudayaan PHBS di Fasyankes').style(brownFill)

  ws.cell(3, 22).string('Melakukan sosialisasi').style(yellowFill)
  ws.column(22).setWidth(20)

  ws.cell(3, 23).string('Media KIE').style(purpleFill)
  ws.column(23).setWidth(20)

  // 7
  ws.cell(2, 24, 2, 26, true).string('Aspek Keselamatan dan Kesehatan  Kerja  pada Pengelolaan Bahan Beracun dan Berbahaya (B3)  dan Limbah Domestik').style(redFill)

  ws.cell(3, 24).string('Daftar inventaris B3').style(yellowFill)
  ws.column(24).setWidth(20)

  ws.cell(3, 25).string('SPO penggunaan B3').style(purpleFill)
  ws.column(25).setWidth(20)

  ws.cell(3, 26).string('Penyimpanan dan Pembuangan limbah B3 dan domestik sesuai persyaratan').style(yellowFill)
  ws.column(26).setWidth(20)

  // 8
  ws.cell(2, 27, 2, 30, true).string('Pengelolaan Sarana dan Prasarana dari Aspek K3').style(brownFill)

  ws.cell(3, 27).string('Pengukuran pencahayaan, kualitas air, kualitas udara').style(purpleFill)
  ws.column(27).setWidth(20)

  ws.cell(3, 28).string('Pemeliharaan Kebersihan Bangunan').style(yellowFill)
  ws.column(28).setWidth(20)

  ws.cell(3, 29).string('Ketersediaan air dan listrik').style(purpleFill)
  ws.column(29).setWidth(20)

  ws.cell(3, 30).string('Ketersediaan toilet sesuai standar').style(yellowFill)
  ws.column(30).setWidth(20)

  // 9
  ws.cell(2, 31).string('Pengelolaan Peralatan Medis Dari Aspek K3').style(redFill)

  ws.cell(3, 31).string('Pemeliharaan pada peralatan medis').style(purpleFill)
  ws.column(31).setWidth(20)

  // 10
  ws.cell(2, 32, 2, 37, true).string('Kesiapsiagaan menghadapi kondisi darurat/bencana ').style(brownFill)

  ws.cell(3, 32).string('SPO Penanganan Kondisi Darurat / Bencana').style(yellowFill)
  ws.column(32).setWidth(20)

  ws.cell(3, 33).string('Proteksi kebakaran').style(purpleFill)
  ws.column(33).setWidth(20)

  ws.cell(3, 34).string('Aktif ( Jumlah APAR dan alat pemadam lainnya)').style(yellowFill)
  ws.column(34).setWidth(20)

  ws.cell(3, 35).string('Pasif ( Pintu dan tangga darurat, jalur evakuasi)').style(purpleFill)
  ws.column(35).setWidth(20)

  ws.cell(3, 36).string('Darurat Bencana').style(yellowFill)
  ws.column(36).setWidth(20)

  ws.cell(3, 37).string('Penggunaan APAR').style(purpleFill)
  ws.column(37).setWidth(20)

  // 11
  ws.cell(2, 38, 2, 39, true).string('Pelatihan').style(redFill)

  ws.cell(3, 38).string('SDM Fasyankes terlatih K3').style(yellowFill)
  ws.column(38).setWidth(20)

  ws.cell(3, 39).string('Jumlah SDM Fasyankes yang terlatih K3').style(purpleFill)
  ws.column(39).setWidth(20)

  return [ws, wb]
}

exports.reportsSemesterHeader = (reportSemester, res) => {
  const [wb, ws, greenFill, yellowFill, redFill, blueFill] = generateExcelFile(reportSemester)

  ws.cell(1, 1, 2, 1, true).string('Nama Operator').style(greenFill)
  ws.column(1).setWidth(50)
  // date
  ws.cell(1, 2, 2, 2, true).string('Tanggal').style(blueFill)
  ws.column(2).setWidth(20)

  // validated
  ws.cell(1, 3, 2, 3, true).string('Status Validasi').style(greenFill)
  ws.column(3).setWidth(25)

  // institution
  ws.cell(1, 4, 2, 4, true).string('Fasyankes').style(blueFill)
  ws.column(4).setWidth(45)

  // report
  ws.cell(1, 5, 1, 20, true).string('Laporan').style(greenFill)

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

exports.notificationHeader = (notificaton, res) => {
  const [wb, ws, greenFill, yellowFill, redFill, blueFill] = generateExcelFile(notificaton)

  debug('Generating file')

  ws.cell(1, 1).string('Jenis Laporan').style(greenFill)
  ws.column(1).setWidth(50)
  // date
  ws.cell(1, 2).string('Tanggal').style(blueFill)
  ws.column(2).setWidth(20)

  // validated
  ws.cell(1, 3).string('Status Peringatan').style(greenFill)
  ws.column(3).setWidth(25)

  // institution
  ws.cell(1, 4).string('Tujuan Peringatan').style(blueFill)
  ws.column(4).setWidth(45)

  return [ws, wb]
}

exports.reportYearTemplate = async (data, res) => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('sheet', {
    pageSetup: { fitToPage: true, fitToHeight: 1 }
  })

  sheet.getCell('A1').value = 'Nama Operator'
  sheet.getCell('B1').value = data.author.full_name
  sheet.getCell('A2').value = 'Tanggal'
  sheet.getCell('B2').value = data.created_at
  sheet.getCell('A3').value = 'Status Validasi'
  sheet.getCell('A4').value = 'Fasyankes'
  sheet.getCell('A5').value = 'Laporan'
  sheet.getCell('A6').value = 'Pelaksanaan Sistem Manajemen K3 di Fasilitas Pelayanan Kesehatan'
  sheet.getCell('A7').value = 'Pelaksanaan Sistem Manajemen K3 di Fasilitas Pelayanan Kesehatan'
  sheet.getCell('A8').value = 'Dokumen rencana kegiatan K3'
  sheet.getCell('A9').value = 'Ada Tim K3/Pengelola  K3'
  sheet.getCell('A10').value = 'Pengenalan Potensi Bahaya dan Pengendalian Resiko'
  sheet.getCell('A11').value = 'Identifikasi potensi bahaya'
  sheet.getCell('A12').value = 'Penilaian risiko'
  sheet.getCell('A13').value = 'Pengendalian risiko'
  sheet.getCell('A14').value = 'Penerapan Kewaspadaan Standar'
  sheet.getCell('A15').value = 'Sarana dan Prasarana Kebersihan Tangan'
  sheet.getCell('A16').value = 'Penyediaan APD'
  sheet.getCell('A17').value = 'Pengelolaan jarun dan alat tajam'
  sheet.getCell('A18').value = 'Dekontaminasi peralatan'
  sheet.getCell('A20').value = 'Penerapan Prinsip Ergonomi Pada'
  sheet.getCell('A21').value = 'Angkat angkut pasien (pasien, barang, dan lain-lain), postur kerja'
  sheet.getCell('A22').value = 'Pengaturan shift kerja'
  sheet.getCell('A23').value = 'Pengaturan Tata Ruang Kerja'
  sheet.getCell('A24').value = 'Pelayanan Kesehatan Kerja dan  Imunisasi'
  sheet.getCell('A25').value = 'Pemeriksaan kesehatan SDM  Fasyankes'
  sheet.getCell('A26').value = 'Fasyankes melakukan pemeriksaan kesehatan berkala'
  sheet.getCell('A27').value = 'Fasyankes melakukan imunisasi pada SDM Fasyankes yang beresiko'
  sheet.getCell('A28').value = 'Pembudayaan PHBS di Fasyankes'
  sheet.getCell('A29').value = 'Melakukan sosialisasi'
  sheet.getCell('A30').value = 'Media KIE'
  sheet.getCell('A31').value = 'Aspek Keselamatan dan Kesehatan  Kerja  pada Pengelolaan Bahan Beracun dan Berbahaya (B3)  dan Limbah Domestik'
  sheet.getCell('A32').value = 'Daftar inventaris B3'
  sheet.getCell('A33').value = 'SPO penggunaan B3'
  sheet.getCell('A34').value = 'Penyimpanan dan Pembuangan limbah B3 dan domestik sesuai persyaratan'
  sheet.getCell('A35').value = 'Pengelolaan Sarana dan Prasarana dari Aspek K3'
  sheet.getCell('A36').value = 'Pengukuran pencahayaan, kualitas air, kualitas udara'
  sheet.getCell('A37').value = 'Pemeliharaan Kebersihan Bangunan'
  sheet.getCell('A38').value = 'Ketersediaan air dan listrik'
  sheet.getCell('A39').value = 'Ketersediaan toilet sesuai standar'
  sheet.getCell('A40').value = 'Pengelolaan Peralatan Medis Dari Aspek K3'
  sheet.getCell('A41').value = 'Pemeliharaan pada peralatan medis'
  sheet.getCell('A42').value = 'Kesiapsiagaan menghadapi kondisi darurat/bencana '
  sheet.getCell('A43').value = 'SPO Penanganan Kondisi Darurat / Bencana'
  sheet.getCell('A44').value = 'Proteksi kebakaran'
  sheet.getCell('A45').value = 'Aktif ( Jumlah APAR dan alat pemadam lainnya)'
  sheet.getCell('A46').value = 'Pasif ( Pintu dan tangga darurat, jalur evakuasi)'
  sheet.getCell('A47').value = 'Darurat Bencana'
  sheet.getCell('A48').value = 'Penggunaan APAR'
  sheet.getCell('A49').value = 'Pelatihan'
  sheet.getCell('A50').value = 'SDM Fasyankes terlatih K3'
  sheet.getCell('A51').value = 'Jumlah SDM Fasyankes yang terlatih K3'
  sheet.columns.forEach(function (column, i) {
    let maxLength = 0
    column.eachCell(function (cell) {
      const columnLength = cell.value ? cell.value.toString().length : 10
      if (columnLength > maxLength) {
        maxLength = columnLength
      }
    })

    column.width = maxLength < 10 ? 10 : maxLength
    column.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  })
  await workbook.xlsx.write(res)
}
