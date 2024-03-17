<template>
  <td class="h-auto p-0" :style="{background: classInfo.color}" role="button" v-if="typeof classInfo == 'object'" :rowspan="calculateDuration(classInfo.startTime, classInfo.endTime)">
    <div class="h-100 d-flex flex-column p-2">
      <p class="m-0 d-flex justify-content-start align-items-center">{{convertTimeTo12HourFormat(classInfo.startTime)}}</p>
      <p class="full m-0 d-flex justify-content-center align-items-center">{{ classInfo.name }}</p>
      <p class="m-0 d-flex justify-content-end align-items-center">{{convertTimeTo12HourFormat(classInfo.endTime)}}</p>
    </div>
  </td>
  <td v-else-if="typeof classInfo == 'number' && classInfo !=  -1">&nbsp;</td>
</template>

<script>
export default {
    name: 'IndivClass',
    props: {
      classInfo: [Object, Number],
      increment: Number,
      day: Number,
      index: Number
    },
    methods: {
      calculateDuration(startTime, endTime) {
        let duration = (parseInt(endTime) - parseInt(startTime));
        if(duration > 0) {
          if(duration >= 100){
            return Math.ceil(duration / 100 * 60 / this.increment);
          }
          return Math.ceil(duration / this.increment);
        }
        return duration != NaN ? duration : 1;
      },
      convertTimeTo12HourFormat(time) {
        time = parseInt(time);
        let hours = Math.floor(time / 100);
        let minutes = time % 100;

        let period = hours < 12 ? 'AM' : 'PM';

        if (hours > 12) {
          hours -= 12;
        } else if (hours === 0) {
          hours = 12;
        }

        let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

        let formattedTime = hours + ':' + formattedMinutes + ' ' + period;

        return formattedTime;
      }
    }
}
</script>

<style>
.full {
  flex-grow: 1;
}
</style>