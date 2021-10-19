/*
时停
 */
import { TargetedMatches } from '@type/trigger';

import { TriggerSet } from '../../cactbot';
import { TEAData } from './data';

function isTemporalStasis (data: TEAData) {
  // return (data.userPhase === 'Temporal Stasis') &&
  return data.phase === 'brute';
}

export const trigger: TriggerSet<TEAData> = {
  zoneId: ZoneId.TheEpicOfAlexanderUltimate,
  triggers: [
    {
      id: 'TEA Temporal Stasis No Buff',
      disabled: true,
    },
    {
      id: 'TEA inception 无 Buff',
      // this is part of `TEA Temporal Stasis No Buff`
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '464', capture: false }),
      condition: (data) => {
        return data.phase === 'inception';
      },
      delaySeconds: 0.5,
      durationSeconds: 10,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (data.buffMap?.[data.me]) {
          return;
        }
        return output.text!();
      },
      outputStrings: {
        text: {
          en: 'No Debuff',
          de: 'Kein Debuff',
          fr: 'Pas de Debuff',
          ja: 'デバフ無し',
          cn: '无 Debuff',
          ko: '디버프 없음',
        },
      },
    },
    {
      id: 'TEA 时停 无Buff',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '464', capture: false }),
      condition: isTemporalStasis,
      delaySeconds: 0.5,
      durationSeconds: 10,
      suppressSeconds: 1,
      alertText (data, _, output) {
        if (data.me in data.buffMap) {
          return;
        }
        if (data.role === 'dps') {
          return output.DPS!();
        }
        return output.TH!();
      },
      outputStrings: {
        TH: '左侧 boss 上方',
        DPS: '左侧 boss 下方',
      },
    },
    {
      id: 'TEA 时停 远线',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '464' }),
      condition (data, matches) {
        return matches.target === data.me && isTemporalStasis(data);
      },
      delaySeconds: 0.5,
      durationSeconds: 10,
      alertText (data, _, output) {
        if (data.role === 'dps') {
          return output.DPS!();
        }
        return output.TH!();
      },
      outputStrings: {
        TH: '去场地左侧边缘 有飞机靠近',
        DPS: '去场地右侧边缘 有飞机靠近',
      },
    },
    {
      id: 'TEA 时停 近线',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '463' }),
      condition (data, matches) {
        return matches.target === data.me && isTemporalStasis(data);
      },
      delaySeconds: 1,
      durationSeconds: 10,
      alertText: (data, _, output) => {
        if (data.role === 'dps') {
          return output.DPS!();
        }
        return output.TH!();
      },
      outputStrings: {
        TH: '右侧 boss 上方',
        DPS: '右侧 boss 下方',
      },
    },
    {
      id: 'TEA 时停 电',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '461' }),
      condition (data, matches: TargetedMatches) {
        return matches.target === data.me && isTemporalStasis(data);
      },
      delaySeconds: 0.5,
      durationSeconds: 10,
      alertText: (data, _, output) => output.text!(),
      outputStrings: {
        text: '正义方向场地边缘',
      },
    },
  ],
};

Options.Triggers.push(trigger);
