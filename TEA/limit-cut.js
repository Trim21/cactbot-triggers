import { TriggerSet } from '../../cactbot';
import { TEAData } from './data';

// p2转场和二运麻将

const getHeadmarkerId = (data: TEAData, matches: { id: string }) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 004F.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined') {
    // The first 1B marker in the encounter is Limit Cut 1, ID 004F.
    data.decOffset = parseInt(matches.id, 16) - 79;
  }
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return '00' + (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase();
};

const limitCut = {
  num1: '麻将1 同侧 下方 引导激光 灵泉3',
  num2: '麻将2 对侧 下方 灵泉3',
  num3: '麻将3 同侧 上方',
  num4: '麻将4 对侧 上方 引导超级跳 往前走一步',
  num5: '麻将5 同侧 中间 灵泉1 下方',
  num6: '麻将6 对侧 中间 灵泉1 下方',
  num7: '麻将7 同侧 中间 灵泉2 上方',
  num8: '麻将8 对侧 中间 灵泉2 上方',
};

export const trigger: TriggerSet<TEAData> = {
  zoneId: ZoneId.TheEpicOfAlexanderUltimate,
  timelineTriggers: [
    {
      id: 'TEA Wormhole Puddle',
      disabled: true,
    },
    {
      id: '灵泉1',
      regex: /Repentance 1/,
      beforeSeconds: 3,
      durationSeconds: 4,
      alertText(data) {
        if ([5, 6].includes(data.limitCutNumber)) {
          return '踩灵泉1';
        }
      },
    },
    {
      id: '灵泉2',
      regex: /Repentance 2/,
      beforeSeconds: 3,
      durationSeconds: 4,
      alertText(data) {
        if ([7, 8].includes(data.limitCutNumber)) {
          return '踩灵泉2';
        }
      },
    },
    {
      id: '灵泉3',
      regex: /Repentance 3/,
      beforeSeconds: 3,
      durationSeconds: 4,
      alertText(data) {
        if ([1, 2].includes(data.limitCutNumber)) {
          return '踩灵泉3';
        }
      },
    },
  ],
  triggers: [
    {
      id: 'TEA Limit Cut Numbers',
      disabled: true,
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({
        source: 'Liquid Hand',
        id: '482D',
        capture: false,
      }),
      netRegexCn: NetRegexes.startsUsing({
        source: 'Liquid Hand',
        id: '482D',
        capture: false,
      }),
    },

    {
      // Applies to both limit cuts.
      id: 'TEA p2 麻将',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition(data, matches) {
        // Here and elsewhere, it's probably best to check for whether the user is the target first,
        // as that should short-circuit more often.
        return (
          data.me === matches.target &&
          /00(?:4F|5[0-6])/.test(getHeadmarkerId(data, matches)) &&
          data.phase !== 'wormhole'
        );
      },
      preRun(data, matches) {
        const correctedMatch = getHeadmarkerId(data, matches);
        data.limitCutNumber = {
          '004F': 1,
          '0050': 2,
          '0051': 3,
          '0052': 4,
          '0053': 5,
          '0054': 6,
          '0055': 7,
          '0056': 8,
        }[correctedMatch]!;
        data.limitCutDelay = {
          '004F': 9.5,
          '0050': 11,
          '0051': 14.1,
          '0052': 15.5,
          '0053': 18.6,
          '0054': 20,
          '0055': 23.2,
          '0056': 24.6,
        }[correctedMatch]!;
      },
      durationSeconds: 25,
      infoText(data) {
        return `麻将 ${data.limitCutNumber}`;
      },
    },

    {
      // Applies to both limit cuts.
      id: 'TEA 二运',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition(data, matches) {
        // Here and elsewhere, it's probably best to check for whether the user is the target first,
        // as that should short-circuit more often.
        return (
          data.me === matches.target &&
          /00(?:4F|5[0-6])/.test(getHeadmarkerId(data, matches)) &&
          data.phase === 'wormhole'
        );
      },
      preRun(data, matches) {
        const correctedMatch = getHeadmarkerId(data, matches);
        data.limitCutNumber = {
          '004F': 1,
          '0050': 2,
          '0051': 3,
          '0052': 4,
          '0053': 5,
          '0054': 6,
          '0055': 7,
          '0056': 8,
        }[correctedMatch]!;
        data.limitCutDelay = {
          '004F': 9.2,
          '0050': 10.7,
          '0051': 13.4,
          '0052': 15.0,
          '0053': 17.7,
          '0054': 19.2,
          '0055': 22.0,
          '0056': 23.4,
        }[correctedMatch]!;
      },
      durationSeconds: 60,
      // durationSeconds: function (data) {
      // Because people are very forgetful,
      // show the number until you are done.
      // return data.limitCutDelay
      // },
      infoText(data, _, output) {
        return output[`num${data.limitCutNumber}`]!();
      },
      outputStrings: limitCut,
    },
    {
      id: 'TEA Shared Sentence Inception',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '462' }),
      condition: (data) => data.phase === 'inception',
      delaySeconds: 3,
      infoText(data, matches, output) {
        switch (data.role) {
          case 'tank':
            return output.T!();
          case 'healer':
            return output.H!();
          case 'dps':
            if (data.me === matches.target) {
              return output.DPSShared!();
            }

            return output.DPSNonShared!();
        }
      },
      outputStrings: {
        T: '左侧分摊',
        H: '右侧等待',
        DPSShared: '左侧分摊',
        DPSNonShared: '右侧等待，然后诱导飞机',
      },
    },
  ],
};
