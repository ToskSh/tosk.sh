import "./css/style.css"

import $ from 'jquery';
import Typewriter from 'typewriter-effect/dist/core';

start();

function start() {
    const title = document.getElementById('title');
    var typewritter_title = new Typewriter(title!, {
        loop: false,
        delay: 25,
        deleteSpeed: 1,
        autoStart: false,
        cursor: '█',
        cursorClassName: 'typerCursorTitle',
    });
    
    typewritter_title
    .typeString("<span class='h1'><strong class='green'>Tosk</strong>.sh, <img alt='command line' id='terminal' src='assets/terminal.png'> <em>productivity.</em></span>")
    .start()
    .changeCursor(" ")
    .callFunction(() => {
        generateLinks().callFunction(() => {
            generateInfo().callFunction(() => {
                // generateAsciiArt();
            });
        });
    })
}

function generateLinks() {
    const links = document.getElementById('links');
    var typewritter_links = new Typewriter(links!, {
        loop: false,
        delay: 25,
        deleteSpeed: 1,
        autoStart: false,
        cursor: '█',
        cursorClassName: 'typerCursor',
    })
    .typeString("<img id='github' src='assets/github.png'> Github project: <a class='green' href='https://github.com/ToskSh/Tosk' title='Github ToskSh/Tosk link'>ToskSh/Tosk</a>")
    .changeCursor(' ')
    .start()

    return typewritter_links;
}

function generateInfo() {
    const info = document.getElementById('info');
    var typewritter_info = new Typewriter(info!, {
        loop: false,
        delay: 25,
        deleteSpeed: 1,
        autoStart: false,
        cursor: '█',
        cursorClassName: 'typerCursorInfo',
    })
    .typeString("<br><span class='h2'><img id='feature' src='assets/feature.png'> <strong>Features</strong>:</span>")
    .typeString("<br><span class='h3'>- 📝 <a class='highlight tooltip tooltip--smaug' onclick='todolist()'><strong>todo-list</strong></a> by project</span>")
    .typeString("<br><span class='h3'>- 💫 terminal <a class='highlight' onclick='cli()'><strong>CLI</strong></a> app</span>")
    .typeString("<br><span class='h3'>- <a class='highlight' onclick='manage()'><strong>Manage</strong></a> your ⏱</span>")
    .typeString("<br><span class='h3'>- ✏️ <a class='highlight' onclick='comments()'><strong>comments</strong></a> to a <a class='highlight' onclick='task()'>task</a> with <a class='highlight' onclick='markdown()'><strong>Markdown</strong></a></span>")
    .typeString("<br><span class='h3'>- Keep <a class='highlight' onclick='focus()'><strong>organized</strong> and <strong>focus</strong> ⛳️</a></span>")
    .typeString("<br><span class='h3'>- <a class='highlight' onclick='git()'><strong>Git</strong> implementation 🪢</a></span>")
    .changeCursor(' ')
    .start()

    return typewritter_info;
}


// Détecter la taille de la fenêtre et charger le fichier ASCII correspondant
function getAsciiFileBasedOnWindowSize(): string {
    const width = window.innerWidth;

    // if (width <= 480) return 'assets/ascii_50.txt';
    if (width <= 768) return 'assets/ascii_200.txt';
    // if (width <= 1024) return 'assets/ascii_200.txt';
    // if (width <= 1440) return 'assets/ascii_300.txt';
    return 'assets/ascii_300_right.txt';
}

// Détecter la taille de la fenêtre et charger le fichier CSS correspondant
function getCssFileBasedOnWindowSize(): string {
    const width = window.innerWidth;

    // if (width <= 480) return 'css/colors_50.css';
    if (width <= 768) return 'css/colors_200.css';
    // if (width <= 1024) return 'css/colors_200.css';
    // if (width <= 1440) return 'css/colors_10.css';
    return 'css/colors_300.css';
}

async function loadAsciiArt(url: string): Promise<string> {
    const response = await fetch(url);
    return await response.text();
}

async function loadCssFile(url: string): Promise<void> {
    const response = await fetch(url);
    const cssText = await response.text();
    const style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);
}

async function generateAsciiArt() {
    try {
        const asciiFile = getAsciiFileBasedOnWindowSize();
        const cssFile = getCssFileBasedOnWindowSize();
        
        await loadCssFile(cssFile);
        const asciiArt = await loadAsciiArt(asciiFile);

        var lines = asciiArt.split('<br>');
        // Parcourir chaque ligne et l'ajouter à la div avec un effet d'animation
        $.each(lines, function(index, line) {
            var lineDiv = $('<div class="line">' + line + '</div>');

            $('#ascii').append(lineDiv);

            lineDiv.delay(index * 100).fadeIn(1000);
        });
    } catch (error) {
        console.error('Error generating ASCII art:', error);
    }
}
