import * as R from 'ramda';
import { isNumber } from 'util';

const MSGS = {
  DISTANCE_INPUT: 'DISTANCE_INPUT',
  TIME_INPUT: 'TIME_INPUT',
  COPY_DISTANCE: 'COPY_DISTANCE',
};

export function distanceInputMsg(distance) {
  return {
    type: MSGS.DISTANCE_INPUT,
    distance
  };
}

export function timeInputMsg(time) {
  return {
    type: MSGS.TIME_INPUT,
    time
  };
}

export function copyDistanceMsg(distance, time) {
  return {
    type: MSGS.COPY_DISTANCE,
    distance, 
    time
  };
}



function update(msg, model) {
  switch (msg.type) {
    case MSGS.DISTANCE_INPUT: {
      const distance = R.pipe(
        parseInt, 
        R.defaultTo(0),
      )(msg.distance);
      return { ...model, distance };
    }
    case MSGS.TIME_INPUT: {
      const {time}  = msg;
      return { ...model, time };
    }
    case MSGS.COPY_DISTANCE: {
      const {distance, time}  = msg;
      console.log(msg);
      return {  distance, time: time.substring(0, time.length - 2) };
    }
  }
  return model;
}



export default update;
