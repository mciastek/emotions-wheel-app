import { Injectable } from '@angular/core';

@Injectable()
export class WheelMapperService {
  private emotionsMap = {
    'disapproval': [0.6125874125874126, 0.7779310344827586],
    'remorse': [0.37902097902097903, 0.7779310344827586],
    'contempt': [0.2153846153846154, 0.6137931034482759],
    'awe': [0.7818181818181819, 0.6151724137931035],
    'submission': [0.7776223776223776, 0.38068965517241377],
    'love': [0.6111888111888112, 0.21793103448275863],
    'optimism': [0.37902097902097903, 0.21793103448275863],
    'aggressiveness': [0.2097902097902098, 0.38482758620689655],
    'pensiveness': [0.5020979020979021, 0.8013793103448276],
    'annoyance': [0.1874125874125874, 0.4993103448275862],
    'anger': [0.2867132867132867, 0.4993103448275862],
    'rage': [0.386013986013986, 0.4993103448275862],
    'ecstasy': [0.4979020979020979, 0.40551724137931033],
    'joy': [0.4979020979020979, 0.2910344827586207],
    'serenity': [0.4979020979020979, 0.2],
    'terror': [0.6027972027972028, 0.5020689655172413],
    'fear': [0.7118881118881119, 0.5020689655172413],
    'apprehension': [0.8041958041958042, 0.5020689655172413],
    'admiration': [0.5762237762237762, 0.4262068965517241],
    'trust': [0.6489510489510489, 0.34758620689655173],
    'acceptance': [0.7146853146853147, 0.2882758620689655],
    'vigilance': [0.4167832167832168, 0.42344827586206896],
    'anticipation': [0.34265734265734266, 0.3489655172413793],
    'interest': [0.28251748251748254, 0.3489655172413793],
    'boredom': [0.2811188811188811, 0.7117241379310345],
    'disgust': [0.34825174825174826, 0.646896551724138],
    'loathing': [0.42097902097902096, 0.5737931034482758],
    'amazement': [0.5804195804195804, 0.5806896551724138],
    'surprise': [0.6503496503496503, 0.6496551724137931],
    'distraction': [0.7132867132867133, 0.7172413793103448],
    'sadness': [0.4951048951048951, 0.713103448275862],
    'grief': [0.4951048951048951, 0.5986206896551725]
  };

  public getNearestLabel({ x, y }) {
    const distancesWithLabels = this.mapToDistances(x, y);
    const distances = Object.keys(distancesWithLabels).map(Number);
    const minDistance = Math.min.apply(null, distances);

    return distancesWithLabels[minDistance];
  }

  private mapToDistances(pointX, pointY) {
    const map = {};

    for (let prop in this.emotionsMap) {
      const [emotionX, emotionY] = this.emotionsMap[prop];
      const distance = this.getDistance(pointX, pointY, emotionX, emotionY);

      map[this.getDistance(pointX, pointY, emotionX, emotionY).toString()] = prop;
    }

    return map;
  }

  private getDistance(x1, y1, x2, y2): number {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  }
}
