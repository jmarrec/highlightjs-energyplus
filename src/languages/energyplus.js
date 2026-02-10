/*
Language: energyplus
Description: EnergyPlus is a whole building energy simulation program that engineers, architects, and researchers use to model both energy consumption and water use in buildings.
Author: Julien Marrec <contact@effibem.com>
Website: https://energyplus.net
Category: scripting
*/

/** @type LanguageFn */
module.exports = function (hljs) {

  const regex = hljs.regex;

  const COMMENT = { variants: [
    hljs.COMMENT('!-', '$', { relevance: 0 }),
    hljs.COMMENT('!', '$', { relevance: 0 }),
  ] };

  const OBJECT_NAMES_KEYWORDS = [
      "Version", "PerformancePrecisionTradeoffs", "ShadowCalculation", "SimulationControl", "Timestep",
    "SurfaceConvectionAlgorithm:Outside", "SurfaceConvectionAlgorithm:Inside",
    "HeatBalanceSettings:ConductionFiniteDifference", "Building", "CommentOnly", "HeatBalanceAlgorithm"
  ];

  const CHOICE_KEYWORDS = [
      "PlantEquipmentOperation:ThermalEnergyStorage", "July", "OutletDampers", "OnePerSurface",
    "ZoneHVAC:Baseboard:Convective:Water", "MinimalShadowing", "Coil:Cooling:DX:MultiSpeed", "DistrictHotWater",
    "DrawThrough", "NonCoincident", "Penman-Monteith", "Suburbs"
  ];

  const LITERALS = [
      "Yes", "No"
  ];

  const IDF_KEYWORDS = {
    type: OBJECT_NAMES_KEYWORDS,
    keyword: CHOICE_KEYWORDS,
    literal: LITERALS
  };

  const FUNCTION = {
    className: 'function',
    begin: regex.concat(
      /^(?:\s*)/,
      `(?!${OBJECT_NAMES_KEYWORDS.join('|')})`,
      /,/
    ),
    end: /;/
  };

  return {
    name: 'energyplus',
    aliases: [
      'idf',
      'IDF'
    ],
    case_insensitive: true,
    keywords: IDF_KEYWORDS,
    contains: [
      FUNCTION,
      COMMENT,
      {
        className: 'meta.version',
        begin: /(?:^\s*[Vv]ersion,\s*)(\d+\.\d+)/,
        relevance: 10
      }
    ]
  };
}
