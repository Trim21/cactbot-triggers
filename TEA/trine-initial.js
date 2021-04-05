// 地火L型三传一

Options.Triggers.push({
  zoneId: ZoneId.TheEpicOfAlexanderUltimate,
  triggers: [
    {
      id: 'TEA Trine Initial',
      netRegex: NetRegexes.abilityFull({
        source: 'Perfect Alexander',
        id: '488F',
        x: '100',
        y: '(?:92|100|108)'
      }),
      netRegexCn: NetRegexes.abilityFull({
        source: '完美亚历山大',
        id: '488F',
        x: '100',
        y: '(?:92|100|108)'
      }),
      netRegexDe: NetRegexes.abilityFull({
        source: 'Perfekter Alexander',
        id: '488F',
        x: '100',
        y: '(?:92|100|108)'
      }),
      netRegexFr: NetRegexes.abilityFull({
        source: 'Alexander parfait',
        id: '488F',
        x: '100',
        y: '(?:92|100|108)'
      }),
      netRegexJa: NetRegexes.abilityFull({
        source: 'パーフェクト・アレキサンダー',
        id: '488F',
        x: '100',
        y: '(?:92|100|108)'
      }),
      netRegexKo: NetRegexes.abilityFull({
        source: '완전체 알렉산더',
        id: '488F',
        x: '100',
        y: '(?:92|100|108)'
      }),
      preRun: function (data, matches) {
        data.trine = data.trine || []
        // See: https://imgur.com/a/l1n9MhS
        data.trine.push({
          92: 'r',
          100: 'g',
          108: 'y',
        }[matches.y])
      },
      alertText: function (data, _, output) {
        // Call out after two, because that's when the mechanic is fully known.
        if (data.trine.length !== 2)
          return

        // Find the third one based on the first two.
        const three = ['r', 'g', 'y'].filter((x) => !data.trine.includes(x))

        // Start on the third trine, then move to the first.
        const ThreeOne = three + data.trine[0]

        // Here's the cactbot strategy.  We'll call this the Zed strategy,
        // as all the movement is along these five squares that form a Z.
        // If these are the circles from https://imgur.com/a/l1n9MhS
        // r = red, g = green, y = yellow, capital = part of the Z
        //
        //   g r y r g
        //
        //   y Y-R g r
        //       |
        //   r g G g y
        //       |
        //   y g Y-R r
        //       3 1
        //   g y r y g
        //
        // Goals:
        // * Start in an obvious place (i.e. the middle of the room).
        // * Players will only have to move in cardinal directions (no diagonals).
        // * Players will only have to make two moves.
        // * The only motion will be along the 5 capital letters connected with lines.
        //
        // Algorithm.
        // (1) Start mid, look north.
        // (2) Watch the three trines in the Z from the middle column.
        //     This is the centered vertical R-G-Y in the diagram.
        // (3) Observe which one is #3.
        // (3) Choose one of (Wait Mid, Move North, Move South) to move to the #3 trine.
        // (4) From #3, only picking from circles in the Z, there is exactly
        //     one adjacent #1 (and exactly one adjacent #2).
        // (5) Move to the #1 circle once #3 explodes.
        // (6) Good work, team.
        //
        // Example:
        // Trines come down with r=1, g=2, y=3 (or north to south 1 2 3 in the middle box).
        // You'd move south to end up on the #3 trine.  Since you know #2 is in the middle
        // the second motion is to go east on the Z.

        // Each three to one has a different set of movements.
        // Call both out to start, then a separate trigger
        // once the first has happened.

        switch (ThreeOne) {
          case 'gr':
            data.secondTrineResponse = 'north'
            return output.waitMiddleDodgeNorth()
          case 'rg':
            data.secondTrineResponse = 'south'
            return output.goNorthDodgeSouth()
          case 'ry':
            data.secondTrineResponse = 'west'
            return output.goNorthDodgeWest()
          case 'yr':
            data.secondTrineResponse = 'east'
            return output.goSouthDodgeEast()
          case 'gy':
            data.secondTrineResponse = 'south'
            return output.waitMiddleDodgeSouth()
          case 'yg':
            data.secondTrineResponse = 'north'
            return output.goSouthDodgeNorth()
        }
      },
      outputStrings: {
        waitMiddleDodgeNorth: {
          en: 'Wait Middle, Dodge North',
          de: 'Warte in der Mitte, ausweichen nach Norden',
          fr: 'Attendez au milieu, esquivez au Nord',
          ja: '中央から北へ',
          cn: '上 -> 右',
          ko: '가운데서 북쪽으로',
        },
        goNorthDodgeSouth: {
          en: 'Go 1 North, Dodge South',
          de: 'Geh nach Norden, ausweichen nach Süden',
          fr: 'Allez 1 au Nord, esquivez au Sud',
          ja: '北から中央へ',
          cn: '右 -> 上',
          ko: '북쪽에서 가운데로',
        },
        goNorthDodgeWest: {
          en: 'Go 1 North, Dodge West',
          de: 'Geh nach Norden, ausweichen nach Westen',
          fr: 'Allez 1 au Nord, esquivez à l\'Ouest',
          ja: '北から西へ',
          cn: '右 -> 中',
          ko: '북쪽에서 서쪽으로',
        },
        goSouthDodgeEast: {
          en: 'Go 1 South, Dodge East',
          de: 'Geh nach Süden, ausweichen nach Osten',
          fr: 'Allez 1 au Sud, esquivez à l\'Est',
          ja: '南から東へ',
          cn: '中 -> 右',
          ko: '남쪽에서 동쪽으로',
        },
        waitMiddleDodgeSouth: {
          en: 'Wait Middle, Dodge South',
          de: 'Warte in der Mitte, ausweichen nach Süden',
          fr: 'Attendez au milieu, esquivez au Sud',
          ja: '中央から南へ',
          cn: '左 -> 中',
          ko: '가운데서 남쪽으로',
        },
        goSouthDodgeNorth: {
          en: 'Go 1 South, Dodge North',
          de: 'Geh nach Süden, ausweichen nach Norden',
          fr: 'Allez 1 au Sud, esquivez au Nord',
          ja: '南から北へ',
          cn: '中 -> 左',
          ko: '남쪽에서 북쪽으로',
        },
      },
    },
  ],
})
