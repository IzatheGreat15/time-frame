<template>
    <div class="row form-group">
        <div class="col-sm-12 col-md-3 my-1">
            <label for="day" class="text-md">Day</label>
            <select name="day" v-model="time.day" class="form-control border-bottom" id="day">
                <option v-for="(day, index) in days" :key="index" :value="day.value">{{ day.name }}</option>
            </select>
        </div>
        <div class="col-sm-12 col-md-4 my-1">
            <label for="start-time" class="text-md">Start Time</label>
            <div class="d-flex" style="margin: auto; gap: 8px;">
                <select name="start-hour" v-model="time.start.hour" id="start-hour" class="form-control">
                    <option v-for="hour in 12" :key="hour" :value="hour">{{ hour }}</option>
                </select>
                <select name="start-minute" v-model="time.start.minute"  id="start-minute" class="form-control">
                    <option v-for="minute in 12" :key="minute" :value="(minute - 1) * 5">{{ ((minute - 1) * 5 < 10 ? '0' : '') + (minute - 1) * 5 }}</option>
                </select>
                <select name="start-shift" v-model="time.start.shift"  id="start-shift" class="form-control">
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
        </div>
        <div class="col-sm-12 col-md-4 my-1">
            <label for="end-time" class="text-md">End Time</label>
            <div class="d-flex" style="margin: auto; gap: 8px;">
                <select name="end-hour" v-model="time.end.hour"  id="end-hour" class="form-control">
                    <option v-for="hour in 12" :key="hour" :value="hour">{{ hour }}</option>
                </select>
                <select name="end-minute" v-model="time.end.minute"  id="end-minute" class="form-control">
                    <option v-for="minute in 12" :key="minute" :value="(minute - 1) * 5">{{ ((minute - 1) * 5 < 10 ? '0' : '') + (minute - 1) * 5 }}</option>
                </select>
                <select name="end-shift" v-model="time.end.shift"  id="end-shift" class="form-control">
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
        </div>
        <div class="col-sm-12 col-md-1 my-1 p-0 d-flex justify-content-center align-items-end pb-3" style="cursor: pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash text-danger" viewBox="0 0 16 16" @click="deleteTime">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
        </div>
    </div>
</template>

<script>
import { days } from '@/assets/data';
export default {
    name: 'Time',
    props: {
        time: Object,
        required: true
    },
    mounted() {
        console.log('time', this.time);
    },
    data() {
        return {
            days: days
        }
    },
    methods: {
        deleteTime() {
            this.$emit('delete');
        }
    }
}
</script>

<style>

</style>