import _, {isNull, isUndefined} from "lodash";
import "./style.css";

type SourcedDiv = {
    id: string,
    link: string
}

type Timer = {
    handler: number,
    counter: number
}

type Config = {
    waitTimeInMs: number,
    divs: SourcedDiv[]
}

export class SourceMe{
    private config: Config;
    private counters: {[id: string] : Timer};

    public constructor(config: Config | undefined | null = undefined) {
        let defaultConfig: Config = {
            waitTimeInMs: 2000,
            divs: []
        }

        this.counters = {};
        this.config = this.mergeDefaultConfig(config, defaultConfig);
        this.start();
    }

    private start(): void{
        _.forEach(this.config.divs, (div: SourcedDiv) => {
            const element = $(`#${div.id}`);
            const badge = $(`
                <div class="sourceme-sourcecode-badge">
                    <i class="devicon-github-original"></i><a href="${div.link}">Broncode</a>
                </div>`);

            this.counters[div.id] = {
                handler: 0,
                counter: 0
            };

            element.on("mouseover", () => {
                //@ts-ignore
                this.counters[div.id].handler = setInterval(() => {
                    if(this.counters[div.id].counter < this.config.waitTimeInMs){
                        this.counters[div.id].counter += 1;
                        if(this.counters[div.id].counter >= this.config.waitTimeInMs){
                            badge.addClass("load");
                            setTimeout(() => {
                                badge.css("opacity", 1);
                            }, 1);
                        }
                    }
                }, 0);
            }).on("mouseleave", () => {
                 clearInterval(this.counters[div.id].handler);
            });

            element.append(badge);
        });
    }

    private mergeDefaultConfig(config: Config | undefined | null, defaultConfig: Config): Config{
        if(isNull(config) || isUndefined(config)){
            return defaultConfig;
        }

        Object.keys(defaultConfig).forEach((key: string) => {
            if (!config.hasOwnProperty(key)) {
                //@ts-ignore
                config[key] = defaultConfig[key];
            }
        });

        return config;
    }
}
