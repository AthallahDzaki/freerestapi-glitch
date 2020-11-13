const { fetchJson } = require('../lib/fetcher')

/**
 * Get Resi Information
 *
 * @param {string} ekspedisi - nama ekpedisi
 * @param {string} resi - no / kode resi
 */
module.exports = cekResi = (ekspedisi, resi) => new Promise((resolve, reject) => {
    fetchJson(`https://api.terhambar.com/resi?resi=${resi}&kurir=${ekspedisi}`)
        .then((result) => {
            if (result.status.code != 200 && result.status.description != 'OK') return resolve(result.status.description)
            // eslint-disable-next-line camelcase
            const { result: { summary, details, delivery_status, manifest } } = result
            const manifestText = manifest.map(x => `â° ${x.manifest_date} ${x.manifest_time}\n â”” ${x.manifest_description}`)
            const resultText = `
ðŸ“¦ Data Ekspedisi
â”œ ${summary.courier_name}
â”œ Nomor: ${summary.waybill_number}
â”œ Service: ${summary.service_code}
â”” Dikirim Pada: ${details.waybill_date}  ${details.waybill_time}
      
ðŸ’ðŸ¼â€â™‚ï¸ Data Pengirim
â”œ Nama: ${details.shippper_name}
â”” Alamat: ${details.shipper_address1} ${details.shipper_city}
      
ðŸŽ¯ Data Penerima
â”œ Nama: ${details.receiver_name}
â”” Alamat: ${details.receiver_address1} ${details.receiver_city}
      
ðŸ“® Status Pengiriman
â”” ${delivery_status.status}
                 
ðŸš§ POD Detail\n
${manifestText.join('\n')}`
            resolve(resultText)
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
})
