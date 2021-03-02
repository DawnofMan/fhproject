// to invoke emulator API and run in the browser.


"use strict";

window.onload = function()
{
    var emb_emulator = window.emulator = new V86Starter({
        wasm_path: "build/v86.wasm",
        memory_size: 32 * 1024 * 1024,
        vga_memory_size: 2 * 1024 * 1024,
        screen_container: document.getElementById("emb_container"),
        bios: {
            url: "bios/seabios.bin",
        },
        vga_bios: {
            url: "bios/vgabios.bin",
        },
        cdrom: {
            url: "images/embed_buildroot_test.iso",
        },
        filesystem: {
    	    basefs: "tools/fstest.json",
	    baseurl: "http://localhost/mnt",
	}, 
        autostart: true,
    });
    

    /*var data = "";

    var stages = [
        {
            test: "~% ",
            send: "ls -1 --color=never /\n",
        },
        {
            test: "~% ",
            send: "lua -e 'print(3+4)'\n",
        },
    ];
    var stage = 0;

    emulator.add_listener("serial0-output-char", function(char)
    {
        if(char === "\r")
        {
            return;
        }

        data += char;
        document.getElementById("terminal").value += char;

        var current = stages[stage];

        if(!current)
        {
            return;
        }

        if(data.endsWith(current.test))
        {
            stage++;
            emulator.serial0_send(current.send);

            var log = "Sending: " + current.send.replace(/\n/g, "\\n") + "\n";
            document.getElementById("log").value += log;
        }
    }); */
}

function on_update_files(files)
{
    var path = document.getElementById("loadPath").value;
    for (var i = 0, f; f = files[i]; i++) {
        jor1k.fs.UploadExternalFile(path, f);
    }
}
