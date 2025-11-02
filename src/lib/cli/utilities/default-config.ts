/** The expected structure of an AKUI config file. */
export interface AkuiConfig {
  registryUrl: string;
  registryDir: string;
  installDir: string;
  registryComponentDir: string;

}

const config: AkuiConfig = {
  installDir: "src/lib/components/akui",
  registryDir: "src/registry/registry.json",
  registryComponentDir: 'src/registry',
  registryUrl: "https://raw.githubusercontent.com/AKCodeWorks/akui/refs/heads/main"
}

const allowedKeys = Object.keys(config);

export { config as defaultConfig, allowedKeys }