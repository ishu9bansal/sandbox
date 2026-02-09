import { CustomSitesConfig, MeasurementArea, MeasurementSite } from "@/models/perio";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CustomSitesSelectorProps {
  config: CustomSitesConfig;
  onChange: (config: CustomSitesConfig) => void;
}

export default function CustomSitesSelector({ config, onChange }: CustomSitesSelectorProps) {
  const areas: MeasurementArea[] = ['Buccal', 'Lingual'];
  const sites: MeasurementSite[] = ['Mesio', 'Mid', 'Disto'];

  const handleToggle = (area: MeasurementArea, site: MeasurementSite) => {
    const newConfig = {
      ...config,
      [area]: {
        ...config[area],
        [site]: !config[area][site],
      },
    };
    onChange(newConfig);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-semibold">Select Sites to Capture</h3>
      <div className="grid grid-cols-2 gap-6">
        {areas.map((area) => (
          <div key={area} className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">{area}</h4>
            <div className="space-y-2">
              {sites.map((site) => (
                <div key={site} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${area}-${site}`}
                    checked={config[area][site]}
                    onCheckedChange={() => handleToggle(area, site)}
                  />
                  <Label
                    htmlFor={`${area}-${site}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {site}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
