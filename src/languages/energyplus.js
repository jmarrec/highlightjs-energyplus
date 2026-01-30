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
      "CommentOnly", "Version", "SimulationControl", "PerformancePrecisionTradeoffs", "Building", "ShadowCalculation",
    "SurfaceConvectionAlgorithm:Inside", "SurfaceConvectionAlgorithm:Outside", "HeatBalanceAlgorithm",
    "HeatBalanceSettings:ConductionFiniteDifference", "Timestep"
  ];

  const CHOICE_KEYWORDS = [
      "SpectralAverage", "CUSTOM", "FixedMinimum", "TotalEfficiencyAndPressure", "GroundCoupledSurface",
    "OnIfHighSolarOrHighLuminanceTillMidnight", "Ice", "Conductivity", "CoolingSetpointOnOffWithComponentOverride",
    "RUB", "Suburbs", "MinimalShadowing"
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
