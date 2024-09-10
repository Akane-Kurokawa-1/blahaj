#!/usr/bin/env node

import checkIfCommandExists from "./commandexists";
import ansis from "ansis";
import { get } from "node:https";
import { createWriteStream } from "node:fs";
import { spawn } from "node:child_process";
import { draw } from "terminal-img";
import { program } from "commander";
const { version } = require("./package.json");


const BLAHAJ_URL: string = "https://www.ikea.com/pl/pl/images/products/blahaj-pluszak-rekin__0710175_pe727378_s5.jpg";
const BABY_BLAHAJ_URL: string = "https://www.ikea.com/pl/pl/images/products/blahaj-pluszak-maly-rekin__0877393_pe730957_s5.jpg";
const BLAHAJ_ASCII_ART_NO_UNICODE = `
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                           (((/                                 
                                        /#(#((                                  
                                       (/((#((                              ((/ 
                                      /(((((/,                           ,((/(  
                                    //(#%(#(/                          ,(((//   
                                 *//####%##(/                         (#(#(/    
               ,*/***/*/**///////////////*/#//*           (%/       ((##(#      
      .*//((//(//////((///(/(////(/////*//(///(*,(*#///(//////*//###(%###//     
   (((((#/(///(*/(/%(*//#((((((/(/((/#(((((#(#((//(#(##(####((/(/////(%%#((/    
  /#(((///#((#(((/((((((#(((#(#(#(#(#(#((#(((((/(((((/#%#((((((((/*/    ####((  
   (((#(&(%##(##%#%##(###((####(###%%(#(##((((#(/(((/(((#/(/(///            //  
     ,#%%#%####%@%###(##(%#(%####(((%#%##(#/(/(((((/(/(/*///                    
         .......*#####(%##(###%#(#(##((((((/(///////(                           
          ..  ..............,..*#&%%#(%#&//                                     
               ..  .........,...,*%%%&%%#(/(/                                   
                       **,,,,*****/##((((#%(#(((                                
                                        ##(%/(((%((((##                         
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
`;
// All sharks below are borrowed from https://ascii.co.uk/art/sharks
// All rights go to their creators
// Credits: Tom Youderian
const BLAHAJ_ASCII_ART_NO_UNICODE_SECOND = `
\\.          |\\
   \`.___---~~  ~~~--_
   //~~----___  (_o_-~
  '           |/'
`;
// Credits: jgs
const BLAHAJ_ASCII_ART_NO_UNICODE_THIRD = `
               ,
             .';
         .-\\\` .'
       ,\\\`.-'-.\`\\\\
      ; /     '-'
      | \\\\       ,-,
      \\\\  '-.__   )_\\\`'._
       '.     \\\`\\\`\\\`      \\\`\\\`'--._
      .-' ,                   \\\`'-.
       '-\\\`-._           ((   o   )
              \\\`'--....(\\\`- ,__..--'
                       '-'
`;

const BLAHAJ_ASCII_ART: string = `
🟦🟦🟦🟦🟦➖🟦🟦
⬜🔳⬜🟦🟦🟦🟦🟦
➖⬜⬜⬜⬜🟦🟦
➖➖⬜⬜⬜⬜🟦🟦
➖🟦🟦➖⬜⬜🟦🟦
➖➖➖➖➖⬜🟦🟦
➖➖➖➖⬜🟦🟦
➖➖➖🟦⬜🟦
➖➖➖🟦🟦`;
const BLAHAJ_GAY_ASCII_ART: string = `
🟥🟥🟥🟥🟥➖🟥🟥
🟧🔳🟧🟧🟧🟧🟧🟧🟧
➖🟨🟨🟨🟨🟨🟨
➖➖🟨🟨🟨🟨🟨🟨
➖🟩🟩➖🟩🟩🟩🟩
➖➖➖➖➖🟩🟩🟩
➖➖➖➖🟦🟦🟦
➖➖➖🟦🟦🟦
➖➖➖🟪🟪`;
const BLAHAJ_LESBIAN_ASCII_ART: string = `
🟥🟥🟥🟥🟥➖🟥🟥
🟥🔳🟥🟥🟥🟥🟥🟥🟥
➖🟧🟧🟧🟧🟧🟧
➖➖🟨🟨🟨🟨🟨🟨
➖⬜⬜➖⬜⬜⬜⬜
➖➖➖➖➖🟪🟪🟪
➖➖➖➖🟪🟪🟪
➖➖➖🟪🟪🟪
➖➖➖🟪🟪`;
const BLAHAJ_TRANSGENDER_ASCII_ART: string = `
🟦🟦🟦🟦🟦➖🟦🟦
⬜🔳⬜🟦🟦🟦🟦🟦
➖🟪🟪🟪🟪🟪🟪
➖➖🟪🟪🟪🟪🟪🟪
➖⬜⬜➖⬜⬜⬜⬜
➖➖➖➖➖🟪🟪🟪
➖➖➖➖🟪🟪🟪
➖➖➖🟦🟦🟦
➖➖➖🟦🟦`;
const BLAHAJ_NONBINARY_ASCII_ART: string = `
🟨🟨🟨🟨🟨➖🟨🟨
⬜🔳⬜🟨🟨🟨🟨🟨
➖⬜⬜⬜⬜⬜⬜
➖➖⬜⬜⬜⬜⬜⬜
➖🟪🟪➖🟪🟪🟪🟪 
➖➖➖➖➖🟪🟪🟪
➖➖➖➖🟪🟪🟪
➖➖➖⬛⬛⬛
➖➖➖⬛⬛`;
// New poly flag because old is ugly kinda, just i preffer the newest one
const BLAHAJ_POLY_ASCII_ART: string = `
🟦🟦🟦🟦🟦➖🟦🟦
⬜🔳⬜🟦🟦🟦🟦🟦
➖🟦🟦🟦🟦🟦🟦
➖➖🟥🟥🟥🟥🟥🟥
➖🟥🟥➖🟥🟥🟥🟥 
➖➖➖➖➖🟥🟥🟥
➖➖➖➖🟪🟪🟪
➖➖➖🟪🟪🟪
➖➖➖🟪🟪`;

const readFromStdin = async () => {
  return new Promise((resolve: any, reject: any) => {
    let data: string = "";

    process.stdin.setEncoding("utf-8");

    process.stdin.on("data", async (chunk: any) => {
      data += chunk;
    });

    process.stdin.on("end", async () => {
      resolve(data);
    });

    process.stdin.on("error", (exception: any) => {
      reject(exception);
    });
  });
}

const main = async (_arguments: string[]) => {
  if (_arguments.length === 2) {
    checkIfCommandExists("viu --version")
    .then((exists) => {
      if (exists) {
        const file = createWriteStream("/tmp/blahaj.jpg");
        get(BLAHAJ_URL, response => {
          response.pipe(file);
          file.on("finish", () => {
            file.close(() => {
              console.log();
              spawn("viu", ["/tmp/blahaj.jpg"], { stdio: "inherit" });
              process.exit(0);
            });
          });
        });
      } else {
        console.error("❌ viu command not found! Please install it from https://github.com/atanunq/viu");
        process.exit(1);
      }
    });
  }

  if (_arguments.length >= 3 && _arguments[2] == "--pipe" || _arguments[2] == "-p") {
    const args: string[] = _arguments.slice(2);
    const data: any = await readFromStdin();
    let background = null;
    let text = null;

    for (let i = 0; i < args.length; i++) {
      switch (args[i]) {
        case "-b":
        case "--background": {
          background = args[++i];
          break;
        }
        case "-t":
        case "--text": {
          text = args[++i];
          break;
        }
      }
    }

    if (background === null && text === null) {
      console.error("Missing flags. Provide background (-b or --background) or text (-t or --text) flag or both.");
      process.exit(1);
    }

    const backgroundLines = data.split("\n");
    let coloredText: string = "";

    if (background === "gay") {
      const gayColors: Array<any> = [
        ansis.bg(196), // Red
        ansis.bg(202), // Orange
        ansis.bg(226), // Yellow
        ansis.bg(40), // Green
        ansis.bg(17), // Blue
        ansis.bg(57), // Violet
      ];

      for (let i = 0; i < backgroundLines.length; i++) {
        const colorIndex = i % gayColors.length;
        coloredText += gayColors[colorIndex](backgroundLines[i]) + "\n"
      }
    } else {
      console.error("Invalid background flag. Use blahaj --help to view available flags.");
      process.exit(1);
    }
    
    console.log(coloredText);
    
    process.exit(0);
  }

  if (_arguments.length >= 3 && _arguments[2] == "--classic" || _arguments[2] == "-c") {
    const args = _arguments.slice(2);
    let width = null;
    let height = null;

    for (let i = 0; i < args.length; i++) {
      switch (args[i]) {
        case "width": {
          width = parseInt(args[++i]);
          break;
        }
        case "height": {
          height = parseInt(args[++i]);
          break;
        }
      }
    }

    console.log(
      await draw(
        BLAHAJ_URL,
        {
          width: width === null ? 80 : width,
          height: height === null ? 80 : height,
        },
      ),
    );
    
    process.exit(0);
  }

  program
    .name("blahaj")
    .description("🦈 Display blahaj in your terminal!")
    .version(version);

  program.command("ascii_art")
    .description("display blahaj as ascii art")
    .option("--no-unicode", "displays ascii art without unicode characters of blahaj")
    .option("--default", "displays default ascii art (unicode) of blahaj")
    .option("--pride <string>", "select pride color of ascii art haj [gay, lesbian, transgender, nonbinary, poly]")
    .action((_, options) => {
      const params = options.parent.args.slice(1);
      const mainOption = params[0];
      const prideFlagOption = params[1];

      switch (mainOption) {
        case "--no-unicode": {
          if (params[1] === "2") {
            console.log(BLAHAJ_ASCII_ART_NO_UNICODE_SECOND);
            process.exit(0);
          }
          if (params[1] === "3") {
            console.log(BLAHAJ_ASCII_ART_NO_UNICODE_THIRD);
            process.exit(0);
          }
          console.log(BLAHAJ_ASCII_ART_NO_UNICODE);
          process.exit(0);
        }
        case "--default": {
          console.log(BLAHAJ_ASCII_ART);
          process.exit(0);
        }
        case "--pride": {
          switch (prideFlagOption) {
            case "gay": {
              console.log(BLAHAJ_GAY_ASCII_ART);
              process.exit(0);
            }
            case "lesbian": {
              console.log(BLAHAJ_LESBIAN_ASCII_ART);
              process.exit(0);
            }
            case "transgender": {
              console.log(BLAHAJ_TRANSGENDER_ASCII_ART);
              process.exit(0);
            }
            case "nonbinary": {
              console.log(BLAHAJ_NONBINARY_ASCII_ART);
              process.exit(0);
            }
            case "poly": {
              console.log(BLAHAJ_POLY_ASCII_ART);
              process.exit(0);
            }
          }
        }
        default: {
          console.log(BLAHAJ_ASCII_ART);
          process.exit(0);
        }
      }
    });

  program
    .option("-p, --pipe <param>", `pipe text to queer colors in terminal (param: background [-b, --background] || text [-t, --text] or both)

Available backgrounds:

  gay

Available texts:

  -
`);
  program
    .option("-c, --classic", "output the blahaj in legacy way by jimp (low quality so you are warned!)");

  program
    .option("-b, --baby", "output the baby blahaj")
    .action(async () => {
      if (_arguments.includes("classic")) {
        const args = _arguments.slice(3);
        let width = null;
        let height = null;

        for (let i = 0; i < args.length; i++) {
          switch (args[i]) {
            case "width": {
              width = parseInt(args[++i]);
              break;
            }
            case "height": {
              height = parseInt(args[++i]);
              break;
            }
          }
        }

        console.log(
          await draw(
            BABY_BLAHAJ_URL,
            {
              width: width === null ? 80 : width,
              height: height === null ? 80 : height,
            },
          ),
        );
        process.exit(0);
      }

      checkIfCommandExists("viu --version")
        .then((exists) => {
          if (exists) {
            const file = createWriteStream("/tmp/baby_blahaj.jpg");
            get(BABY_BLAHAJ_URL, response => {
              response.pipe(file);
              file.on("finish", () => {
                file.close(() => {
                  console.log();
                  spawn("viu", ["/tmp/baby_blahaj.jpg"], { stdio: "inherit" });
                  process.exit(0);
                });
              });
            });
          } else {
            console.error("❌ viu command not found! Please install it from https://github.com/atanunq/viu");
            process.exit(1);
          }
        });
    });

  program.parse(_arguments);
}

main(process.argv);