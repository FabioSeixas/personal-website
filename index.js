/*!
 * AnderShell - Just a small CSS demo
 *
 * Copyright (c) 2011-2018, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import './src/styles.scss';
import { terminal } from './src/terminal.js';

// Banner text
const banner = `
Copyright (c) 2014 Anders Evenrud <andersevenrud@gmail.com>

  Hello, I'm Fábio, a software developer from Brazil.
  Type "help" to know what you can do here.
`;

// Help text
const helpText = `
help             This output
about            Breaf introduction of your host
contact          Prints contact information
contact <key>    Opens up relevant contact link
clear            Clears the display 
projects         Summary of my projects`
// ls               Lists files
// cwd              Lists current directory
// cd <dir>         Enters directory
// cat <filename>    Lists file contents
const projectsInfo = {
  cassavaPy: {
    repository: "https://github.com/FabioSeixas/CassavaPy",
    language: "python",
    description: "A module to write, run and get outputs from DSSAT-Manihot model"
  },
  emergEconRPG: {
    repository: "https://github.com/FabioSeixas/emergEconRPG",
    language: "C#",
    description: 'An implementation of "Emergent Economies for Role Playing Games"'
  }
}

const projectList = Object.keys(projectsInfo)
  .reduce((result, key) => result.concat([`${key}\n - repository: ${projectsInfo[key].repository}\n - language: ${projectsInfo[key].language}\n - description: ${projectsInfo[key].description}`]), [])
  .join('\n\n');

const projects = `
${projectList}
`
const aboutMe = `
They call me Fábio
I'm 28 years old
I'm from Bahia, Brazil
I have a daughter and she is seven
My background is on Agricultural Engineering
I started as a professional web developer in Nov 2020
My first company was Badico Cloud
I learned a ton and made very good friends there
Now I'm focused on mobile development with React Native
I use javascript stack most part of the time
But I am really curious about computing in general
Which makes my interests really broad
`;
// Contact texts
const contactInfo = {
  email: 'dev.fabioseixas@gmail.com',
  linkedin: 'https://www.linkedin.com/in/fabioseixas',
  github: 'https://github.com/fabioseixas'
};

const contactList = Object.keys(contactInfo)
  .reduce((result, key) => result.concat([`${key} - ${contactInfo[key]}`]), [])
  .join('\n');

const contactText = `

${contactList}

Use ex. 'contact linkedin' to open the links.`;

const openContact = key => window.open(key === 'email'
  ? `mailto:${contactInfo[key]}`
  : contactInfo[key]);

// File browser
const browser = (function() {
  let current = '/';

  let tree = [{
    location: '/',
    filename: 'documents',
    type: 'directory'
  }, {
    location: '/',
    filename: 'AUTHOR',
    type: 'file',
    content: 'Anders Evenrud <andersevenrud@gmail.com>'
  }];

  const fix = str => str.trim().replace(/\/+/g, '/') || '/';

  const setCurrent = dir => {
    if (typeof dir !== 'undefined') {
      if (dir == '..') {
        const parts = current.split('/');
        parts.pop();
        current = fix(parts.join('/'));
      } else {
        const found = tree.filter(iter => iter.location === current)
          .find(iter => iter.filename === fix(dir));

        if (found) {
          current = fix(current + '/' + dir);
        } else {
          return `Directory '${dir}' not found in '${current}'`;
        }
      }

      return `Entered '${current}'`;
    }

    return current;
  };

  const ls = () => {
    const found = tree.filter(iter => iter.location === current);
    const fileCount = found.filter(iter => iter.type === 'file').length;
    const directoryCount = found.filter(iter => iter.type === 'directory').length;
    const status = `${fileCount} file(s), ${directoryCount} dir(s)`;
    const maxlen = Math.max(...found.map(iter => iter.filename).map(n => n.length));

    const list = found.map(iter => {
      return `${iter.filename.padEnd(maxlen + 1, ' ')} <${iter.type}>`;
    }).join('\n');

    return `${list}\n\n${status} in ${current}`;
  };

  const cat = filename => {
    const found = tree.filter(iter => iter.location === current);
    const foundFile = found.find(iter => iter.filename === filename);

    if (foundFile) {
      return foundFile.content;
    }

    return `File '${filename}' not found in '${current}'`;
  };

  return {
    cwd: () => setCurrent(),
    cd: dir => setCurrent(fix(dir)),
    cat,
    ls
  };
})();

///////////////////////////////////////////////////////////////////////////////
// MAIN
///////////////////////////////////////////////////////////////////////////////

const load = () => {
  const t = terminal({
    // prompt: () => `$ ${browser.cwd()} > `,
    prompt: () => `> `,
    promptWaiting: () => `...`,
    banner,
    commands: {
      help: () => helpText,
      about: () => aboutMe,
      projects: () => projects,
      resumeBuffer: (...rest) => {
        return rest.map(string => !string ? ' ' : `${string} `).join('')
      },
      // cwd: () => browser.cwd(),
      // cd: dir => browser.cd(dir),
      // ls: () => browser.ls(),
      // cat: file => browser.cat(file),
      clear: () => t.clear(),
      contact: (key) => {
        if (key in contactInfo) {
          openContact(key);
          return `Opening ${key} - ${contactInfo[key]}`;
        }

        return contactText;
      }
    }
  });
};

document.addEventListener('DOMContentLoaded', load);
