const fs = require('fs')
const EventEmitter= require('events')

let emitter = new EventEmitter();

let resultado = {
    date : '',
    hour: '',
    freememory: '',
    diskspace: '',
}

let caminho = "/home/pablosilva/util/memorialog/"
let arquivoLog = caminho.concat("limpa.log")
let arquivoCSV = caminho.concat('saida.csv')

fs.unlink(arquivoCSV, () => {});

fs.readFile(arquivoLog, { encoding: 'utf8' }, (err, data) => {
    if(err) {
        console.log(err)
        return
    }

    lines = data.split('\n')

    lines.forEach(line => {
        if(line.substr(0, 16) == 'Datetime started') {
            columns = line.split(' ')
            resultado.date = columns[2]
            resultado.hour = columns[3].substr(0, 5)
            resultado.freememory = '0'
            resultado.diskspace = '0'
        }

        columns = line.replace(/\s+/g, ' ').split(' ')
        
        if(columns[0] == 'Mem.:') {
            resultado.freememory = columns[6]
        }

        if(columns[0] == '/dev/nvme0n1p2') {
            resultado.diskspace = columns[3]
        }

        if(line.substr(0, 17) == 'Datetime finished') {
            //console.log('finished', resultado)

            emitter.emit('event:registro', resultado)

            resultado.date = ''
            resultado.hour = ''
            resultado.freememory = '0'
            resultado.diskspace = '0'
        }
    });

});

emitter.on('event:registro', data => {
     let csv = Object.values(data).join(';')

     fs.appendFile(arquivoCSV, csv + '\n', (err) => {
         if(err) throw err;
     })
});


emitter.on('event:outroregistro', data => {
    console.log('acho que nao executa')
});
