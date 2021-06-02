'use strict';

const { Terminal } = require('xterm');
const { FitAddon } = require('xterm-addon-fit');
require('regenerator-runtime');
const filesystem = require('./filesystem');
const { emulatorDefaultParams } = require('./dtconfig');

let emulator = null;

const startDigitalTwin = () => {
  window.addEventListener('DOMContentLoaded', () => {
    const xterm = (window.xterm = new Terminal());
    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.open(document.getElementById('vm_console'));
    fitAddon.fit();

    // Power up the virtual machine
    document.querySelector('#vm_poweron').onclick = function () {
      if (!emulator) {
        coldBoot(xterm);
      }
    };

    // Restart the virtual machine
    document.querySelector('#vm_restart').onclick = function () {
      if (emulator.is_running()) {
        emulator.restart();
      }
    };

    // Take Snapshot
    document.querySelector('#vm_take_snapshot').onclick = function () {
      emulator.save_state(function (error, snapshot) {
        if (error) {
          throw error;
        }

        var dt = document.createElement("a");
        dt.download = "vmSnapshot.bin";
        dt.href = window.URL.createObjectURL(new Blob([snapshot]));
        dt.dataset.downloadurl = "application/octet-stream:" + dt.download + ":" + dt.href;
        dt.click();
      });
    };

    // Load Snapshot
    document.querySelector('#vm_load_snapshot').addEventListener('change', (e) => {
      console.log('load snapshot');

      // Browser FileReader API
      const reader = new FileReader();
      reader.onload = function (e) {
        if (emulator) {
          console.log('emulator running.. stopping now');
          emulator.stop();
          emulator.restore_state(e.target.result);
          emulator.run();
        } else {
          //var vmState = e.target.result;
          const params = Object.create(emulatorDefaultParams);
          //params.initial_state = { 'e.target.result' } ;
          console.log('parm' + emulatorDefaultParams);
          hardBoot(xterm, params);
        }
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    });

    // File Upload
    document.querySelector('#vm_upload').addEventListener('change', (e) => {
      for (var i = 0; i < e.target.files.length; i++) {
        filesystem.uploadFile(e.target.files[i].name, e.target.files[i], emulator);
      }
    });

    // File Download
    document.querySelector('#vm_downpath').addEventListener('keypress', (e) => {
      if (e.which == 13) {
        filesystem.readFile(e.target.value, emulator);
      }
    });
  });
};

// First-time VM booting
const coldBoot = async xterm => {
  console.log('cold boot called');
  emulator = new V86Starter(emulatorDefaultParams);
  setVMStatus(emulator);
  await checkBootCompletion(emulator, xterm);
  //filesystem.welcome(emulator);
  setWelcomeScreen(emulator, xterm);
  return emulator;
};

// Snapshot VM booting
const hardBoot = async (xterm, params) => {
  console.log('params ' + params);
  console.log('hard boot called');
  emulator = new V86Starter(params);
  //setVMStatus(emulator);
  await checkBootCompletion(emulator, xterm);
  //filesystem.welcome(emulator);
  setWelcomeScreen(emulator, xterm);
  //return emulator;
};

// Set VM status information
const setVMStatus = emulator => {

  var netStatus = {
    bytesTrasmitted: 0,
    bytesReceived: 0,
  };
  var lastTick = 0;
  var uptime = 0;
  var lastInstrCount = 0;
  var totalInstructions = 0;

  emulator.add_listener("emulator-started", function()
  {
    var start = Date.now();
    var instructionCount = emulator.get_instruction_counter();
    console.log('instru conu ' + instructionCount);
            if(instructionCount < lastInstrCount)
            {
                // 32-bit wrap-around
                lastInstrCount -= 0x100000000;
            }

            var last_ips = instructionCount - lastInstrCount;
            lastInstrCount = instructionCount;
            totalInstructions += last_ips;

            var delta_time = start - lastTick;
            //console.log('delta' + delta_time);
            uptime += delta_time;
            //console.log('up' + uptime);
            lastTick = start;
   
   setInterval(function()
    {
       document.querySelector('#uptime').textContent = format_timestamp((Date.now() - start) / 1000 | 0);
    }, 999);
   setInterval(function()
   {
       document.querySelector('#speed').textContent = (last_ips / 1000 / delta_time).toFixed(1);
   }, 999);
   setInterval(function()
   {
       document.querySelector('#avg_speed').textContent = (totalInstructions / 1000 / uptime).toFixed(1);
   }, 999);
});

      emulator.add_listener("eth-receive-end", function(args)
        {
            netStatus.bytesReceived += args[0];
            document.querySelector('#info_network_bytes_received').textContent = netStatus.bytesReceived;
        });
        emulator.add_listener("eth-transmit-end", function(args)
        {
            netStatus.bytesTrasmitted += args[0];
            document.querySelector('#info_network_bytes_transmitted').textContent = netStatus.bytesTrasmitted;
        });

}

// Read the console and  the boot message in the console
const checkBootCompletion = async (emulator, xterm) =>
  new Promise(resolve => {
    let screenData = [];
    let serialData = '';
    let row;
 
    function checkScreenData(data) {
      const rows = data[0];
      const columns = data[1];
      const char = data[2];
      if(rows !== row) {
        row = rows;
        xterm.writeln(screenData.join(''));
        screenData = [];
      }
      screenData[columns] = String.fromCharCode(char);
    }

    function checkSerialData(char) {
       serialData += char;
      // check for the root user character in the terminal
      if (serialData.endsWith('/ # ')) {
        emulator.remove_listener('screen-put-char', checkScreenData);
        emulator.remove_listener('serial0-output-char', checkSerialData);
        xterm.clear();

       resolve();
      }
    }
      
    emulator.add_listener('screen-put-char', checkScreenData);
    emulator.add_listener('serial0-output-char', checkSerialData);
  });

  // Set welcome screen and clear booting console message.
const setWelcomeScreen = (emulator, xterm) => {
  xterm.reset();
  xterm.writeln('Now you can interact with the Digital Twin using this serial console.');
  xterm.writeln('Welcome to SPRECON Digital Twin');
  xterm.writeln('The filesystem is mounted in /mnt. Guest <-> Host');
  xterm.write('/ # ');
   xterm.onData((data) => {
    emulator.serial0_send(data)
   });
   emulator.add_listener('serial0-output-char', char => xterm.write(char));
   xterm.clear();
};

const format_timestamp = time => {
  if(time < 60)
        {
            return time + "s";
        }
        else if(time < 3600)
        {
            return (time / 60 | 0) + "m " + (time % 60) + "s";
        }
        else
        {
            return (time / 3600 | 0) + "h " +
                ((time / 60 | 0) % 60) + "m " +
                (time % 60) + "s";
        }
    }

module.exports.startDigitalTwin = startDigitalTwin;

