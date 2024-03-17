<template>
    <div class="table-container ">
        <table class="w-full">
            <thead>
                <tr class="text-center">
                    <th :style="{'width' : columnWidth}" v-if="selectedSchedule.settings.days[0]">Sun</th>
                    <th :style="{'width' : columnWidth}" v-if="selectedSchedule.settings.days[1]">Mon</th>
                    <th :style="{'width' : columnWidth}" v-if="selectedSchedule.settings.days[2]">Tue</th>
                    <th :style="{'width' : columnWidth}" v-if="selectedSchedule.settings.days[3]">Wed</th>
                    <th :style="{'width' : columnWidth}" v-if="selectedSchedule.settings.days[4]">Thu</th>
                    <th :style="{'width' : columnWidth}" v-if="selectedSchedule.settings.days[5]">Fri</th>
                    <th :style="{'width' : columnWidth}" v-if="selectedSchedule.settings.days[6]">Sat</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="time in totalDuration" :key="time" class="text-center">
                    <template v-for="(day, index) in selectedSchedule.settings.days.length" :key="day">
                        <template v-if="selectedSchedule.settings.days[index]">
                            <IndivClass :classInfo="findClass(time, index)" :increment="increment" :day="day" :index="index"/>
                        </template>
                    </template>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { getMinutesDifference } from '@/functions';
import IndivClass from './IndivClass.vue';
export default {
    name: 'Classes',
    components: {
        IndivClass
    },
    data() {
        return {
            increment: 5,
        }
    },
    props: {
        selectedSchedule: {
            type: Object
        },
    },
    created() {
        console.log(this.selectedSchedule);
    },
    computed: {
        columnWidth() {
            const selectedDays = this.selectedSchedule.settings.days.filter(day => day === true).length;
            return selectedDays > 0 ? `${100 / selectedDays}%` : '0%';
        },
        smallestStartTime() {
            if (this.selectedSchedule.classes.length === 0) {
                return 0;
            }

            return Math.min(...this.selectedSchedule.classes.map(classItem => parseInt(classItem.startTime)));
        },
        largestEndTime() {
            if (this.selectedSchedule.classes.length === 0) {
                return 0;
            }

            return Math.max(...this.selectedSchedule.classes.map(classItem => parseInt(classItem.endTime)));
        },
        totalDuration() {
            let totalDuration = getMinutesDifference(this.smallestStartTime, this.largestEndTime);
            if(totalDuration > 0) {
                return Math.ceil(totalDuration / this.increment);
            }

            return 0;
        },
    },
    methods: {
        addSectionToTime(currentTime){
            let currentHour = Math.floor(currentTime / 100); // Extract the current hour
                let currentMinute = currentTime % 100; // Extract the current minute
                currentMinute += this.increment; // Add this.increment minutes

                if (currentMinute >= 60) {
                    currentMinute -= 60; // Adjust the minutes if it's equal to or greater than 60
                    currentHour++; // Increment the hour
                }

                return currentHour * 100 + currentMinute; // Combine the hour and minute back into currentTime
        },
        findClass(time, day) {
            let currentTime = parseInt(this.smallestStartTime);
            for (let i = 0; i < time; i++) {
                currentTime = this.addSectionToTime(currentTime);
            }

            let foundClass = this.selectedSchedule.classes.find(classItem => {
                return classItem.day == parseInt(day) && currentTime > parseInt(classItem.startTime) && currentTime <= parseInt(classItem.endTime);
            });

            if(foundClass) {
                if(this.addSectionToTime(parseInt(foundClass.startTime)) == currentTime ) {
                    return foundClass; // return a colored class with corresponding rowspan
                }

                return -1; // don't do anything
            }

            return 0; // return a transparent class
        },
    }
}
</script>

<style>
.table-container {
    flex: 1;
    overflow-y: auto;
}

table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    border-style: hidden;
}
th {
    border: 1px solid white;
}
td {
    border-left: 1px solid white;
    border-right: 1px solid white;
}
</style>