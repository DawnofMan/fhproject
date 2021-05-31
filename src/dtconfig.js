'use strict';

module.exports = {

  emulatorDefaultParams: {
    wasm_path: 'build/v86.wasm',
    memory_size: 1024 * 1024 * 1024,
    vga_memory_size: 8 * 1024 * 1024,
    screen_container: document.getElementById('vm_container'),
    bios: {
      url: 'bios/seabios.bin',
    },
    vga_bios: {
      url: 'bios/vgabios.bin',
    },
    cdrom: {
      url: 'build/v86-linux.iso',
      async: true,
    },
    //initial_state: { url: 'build/vmSnapshot.bin' },
    // hda: {
    //   url: 'build/web.img',
    //   //size: 0.5 * 1024 * 1024 * 1024,
    //   async: true,
    // },
    network_relay_url: 'wss://relay.widgetry.org/',
    filesystem: {
           basefs: "tools/fstest.json",
           baseurl: "/mnt/",
       },
    disable_mouse: false,
    disable_keyboard: false,
    disable_speaker: true,
    autostart: true
  },

};



 
