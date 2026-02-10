import { SelectInput } from "@/components/compositions/select-input";
import { Label } from "@/components/ui/label";
import { SitesConfig, MeasurementSite } from "@/models/perio";

interface CustomSitesSelectorProps {
  config: SitesConfig;
  onChange: (config: SitesConfig) => void;
}

export default function CustomSitesSelector({ config, onChange }: CustomSitesSelectorProps) {
  const sites: MeasurementSite[] = ['Mesio', 'Mid', 'Disto'];

  const hasAnySiteEnabled = (cfg: SitesConfig): boolean => {
    return sites.some(site => cfg.Buccal[site] || cfg.Lingual[site]);
  };

  const handleToggle = (area: 'Buccal' | 'Lingual', site: MeasurementSite) => {
    const newConfig = {
      ...config,
      [area]: {
        ...config[area],
        [site]: !config[area][site],
      },
    };
    // Only update if at least one site remains enabled
    if (hasAnySiteEnabled(newConfig)) {
      onChange(newConfig);
    }
  };

  const allDisabled = !hasAnySiteEnabled(config);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Site Selection</h3>
      {allDisabled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm text-yellow-800">
          ⚠️ At least one site must be selected
        </div>
      )}
      <div className="inline-grid grid-cols-2 border-2 border-gray-300 rounded-lg p-2 bg-white">
        {/* Top row - Buccal */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 border-2 border-blue-600 rounded"></div>
          <span>Buccal</span>
        </div>
        <div className="grid grid-cols-3 gap-1 mb-1">
          {sites.map((site) => (
            <button
              key={`buccal-${site}`}
              type="button"
              onClick={() => handleToggle('Buccal', site)}
              className={`
                w-7 h-7 border-2 rounded-md font-medium text-xs transition-colors
                ${config.Buccal[site] 
                  ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600' 
                  : 'bg-gray-100 text-gray-400 border-gray-300 hover:bg-gray-200'
                }
              `}
              title={`Buccal ${site}`}
            >
              {site.charAt(0)+site.charAt(1)}
            </button>
          ))}
        </div>
        {/* Bottom row - Lingual */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 border-2 border-green-600 rounded"></div>
          <span>Lingual</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {sites.map((site) => (
            <button
              key={`lingual-${site}`}
              type="button"
              onClick={() => handleToggle('Lingual', site)}
              className={`
                w-7 h-7 border-2 rounded-md font-medium text-xs transition-colors
                ${config.Lingual[site] 
                  ? 'bg-green-500 text-white border-green-600 hover:bg-green-600' 
                  : 'bg-gray-100 text-gray-400 border-gray-300 hover:bg-gray-200'
                }
              `}
              title={`Lingual ${site}`}
            >
              {site.charAt(0)+site.charAt(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const PRESETS: Record<string, SitesConfig> = {
  '6 site': {
    Buccal: { Mesio: true, Mid: true, Disto: true },
    Lingual: { Mesio: true, Mid: true, Disto: true },
  },
  '4 site': {
    Buccal: { Mesio: true, Mid: true, Disto: true },
    Lingual: { Mesio: false, Mid: true, Disto: false },
  },
}

export function PresetSitesSelector({ config, onChange }: CustomSitesSelectorProps) {
  const handlePresetChange = (preset: string) => {
    const newConfig = PRESETS[preset];
    if (newConfig) {
      onChange(newConfig);
    }
  };
  const derivedPreset = Object.entries(PRESETS).find(([_, presetConfig]) => {
    return JSON.stringify(presetConfig) === JSON.stringify(config);
  })?.[0];

  const type = derivedPreset || 'Custom';

  return (
    <>
      <Label className="mb-2">Preset Site Selection</Label>
      <SelectInput
        value={type} 
        onChange={(value) => handlePresetChange(value)} 
        options={Object.keys(PRESETS).concat('Custom').map(p => ({ label: p, value: p, disabled: p === 'Custom' }))} 
      />
    </>
  );
}
