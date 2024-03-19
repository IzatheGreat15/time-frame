<template>
    <div class="position-absolute bg-violet add-btn" data-toggle="modal" data-target="#addClassModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-plus-lg" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
        </svg>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="addClassModal" tabindex="-1" role="dialog" aria-labelledby="addClassLabel" aria-hidden="false">
        <div class="modal-dialog modal-lg" role="document">
        <form @submit.prevent="addClassSubmit"  class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title text-dark" id="addClassLabel">Add Class</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
                <div class="text-dark">
                    <div class="form-group">
                        <label for="class-name" class="text-md">Class Name</label>
                        <input type="text" v-model="classInfo.name" class="form-control border-bottom" id="class-name" placeholder="Biology 101">
                    </div>
                    <div class="form-group">
                        <label for="room" class="text-md">Room</label>
                        <input type="text" v-model="classInfo.room" class="form-control border-bottom" id="room" placeholder="Room 1423">
                    </div>
                    <div class="form-group">
                        <label for="teacher" class="text-md">Teacher</label>
                        <input type="text" v-model="classInfo.teacher" class="form-control border-bottom" id="teacher" placeholder="Mr. Holmes">
                    </div>
                    <div class="form-group">
                        <label for="color" class="text-md">Color</label>
                        <input type="color" v-model="classInfo.color" class="form-control form-control-color p-0 border-bottom" id="color" value="#000000">
                    </div>
                    <div class="form-group">
                        <label for="times" class="text-md">Times</label>
                        <div id="times-fields">
                            <Time v-for="(time, index) in classInfo.times" :key="index" @delete="deleteTime(index)" :time="time" :selectedDays="selectedDays"></Time>
                        </div>
                    </div>
                    
                    <div class="text-center" @click="addTime" style="cursor: pointer">
                        <p>+ Add Time</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
            <button type="submit" class="btn bg-violet text-dark" id="save-class-btn">Save changes</button>
            </div>
        </form>
        </div>
    </div>
</template>

<script>
import { addClass } from '@/functions';
import Time from './Time.vue';

export default {
    name: 'AddClass',
    components: {
        Time
    },
    props: {
        userId: String,
        scheduleId: String,
        selectedDays: Array
    },
    data(){
        return {
            classInfo: {
                name: '',
                room: '',
                teacher: '',
                color: '#000000',
                times: [
                    {
                        day: '',
                        start: {
                            hour: '',
                            minute: '',
                            shift: ''
                        },
                        end: {
                            hour: '',
                            minute: '',
                            shift: ''
                        }
                    }
                ]
            }
        }
    },
    mounted() {
        $('#addClassModal').on('show.bs.modal', this.resetForm);
    },
    beforeDestroy() {
        $('#addClassModal').off('show.bs.modal', this.resetForm);
    },
    methods: {
        addTime() {
            this.classInfo.times.push({
                    day: '',
                    start: {
                        hour: '',
                        minute: '',
                        shift: ''
                    },
                    end: {
                        hour: '',
                        minute: '',
                        shift: ''
                    }
                });
        },
        deleteTime(index) {
            this.classInfo.times.splice(index, 1);
        },
        resetForm() {
            const elements = document.querySelectorAll('.border-danger, .is-invalid, .text-danger');
            elements.forEach(element => {
                if (element.tagName !== 'svg') {
                    element.classList.remove('border-danger', 'is-invalid', 'text-danger');
                }   
            });

            this.classInfo = {
                name: '',
                room: '',
                teacher: '',
                color: '#000000',
                times: [
                    {
                        day: '',
                        start: {
                            hour: '',
                            minute: '',
                            shift: ''
                        },
                        end: {
                            hour: '',
                            minute: '',
                            shift: ''
                        }
                    }
                ]
            };
        },
        async addClassSubmit() {
            if(this.checkValidation()) {
                document.getElementById('save-class-btn').disabled = true;
                try{
                    const newClassId = await addClass(this.scheduleId, this.userId, this.classInfo);
       
                    if(newClassId) {
                        $('#addClassModal').modal('hide');
                        document.getElementById('save-class-btn').disabled = false;
                    }
                } catch (error) {
                    console.error('Error adding class:', error);
                    document.getElementById('save-class-btn').disabled = false;
                }
            }

            return;
        },
        checkValidation() {
            let isValid = true;

            const elements = document.querySelectorAll('.border-danger, .is-invalid, .text-danger');
            elements.forEach(element => {
                if (element.tagName !== 'svg') {
                    element.classList.remove('border-danger', 'is-invalid', 'text-danger');
            }
            });

            if(this.classInfo.name === '') {
                document.getElementById('class-name').classList.add('border-danger', 'is-invalid');
                document.querySelector('label[for="class-name"]').classList.add('text-danger');
                
                isValid = false;
            }

            if(this.classInfo.room === '') {
                document.getElementById('room').classList.add('border-danger', 'is-invalid');
                document.querySelector('label[for="room"]').classList.add('text-danger');
                
                isValid = false;
            }

            if(this.classInfo.teacher === '') {
                document.getElementById('teacher').classList.add('border-danger', 'is-invalid');
                document.querySelector('label[for="teacher"]').classList.add('text-danger');
                
                isValid = false;
            }

            const timeComponents = document.querySelectorAll('#times-fields .row.form-group');
            timeComponents.forEach((timeComponent, index) => {
                const daySelect = timeComponent.querySelector('select[name="day"]');
                const startHourSelect = timeComponent.querySelector('select[name="start-hour"]');
                const startMinuteSelect = timeComponent.querySelector('select[name="start-minute"]');
                const startShiftSelect = timeComponent.querySelector('select[name="start-shift"]');
                const endHourSelect = timeComponent.querySelector('select[name="end-hour"]');
                const endMinuteSelect = timeComponent.querySelector('select[name="end-minute"]');
                const endShiftSelect = timeComponent.querySelector('select[name="end-shift"]');

                if(daySelect.value === '') {
                    daySelect.classList.add('border-danger', 'is-invalid');
                    isValid = false;
                }

                if(startHourSelect.value === '') {
                    startHourSelect.classList.add('border-danger', 'is-invalid');
                    isValid = false;
                }

                if(startMinuteSelect.value === '') {
                    startMinuteSelect.classList.add('border-danger', 'is-invalid');
                    isValid = false;
                }

                if(startShiftSelect.value === '') {
                    startShiftSelect.classList.add('border-danger', 'is-invalid');
                    isValid = false;
                }

                if(endHourSelect.value === '') {
                    endHourSelect.classList.add('border-danger', 'is-invalid');
                    isValid = false;
                }

                if(endMinuteSelect.value === '') {
                    endMinuteSelect.classList.add('border-danger', 'is-invalid');
                    isValid = false;
                }

                if(endShiftSelect.value === '') {
                    endShiftSelect.classList.add('border-danger', 'is-invalid');
                    isValid = false;
                }

                const startHour = parseInt(startHourSelect.value);
                const startMinute = parseInt(startMinuteSelect.value);
                const startShift = startShiftSelect.value;

                const endHour = parseInt(endHourSelect.value);
                const endMinute = parseInt(endMinuteSelect.value);
                const endShift = endShiftSelect.value;

                // Convert to 24-hour format
                let startHour24 = startHour;
                let endHour24 = endHour;

                if (startShift === 'PM' && startHour !== 12) {
                    startHour24 += 12;
                }

                if (endShift === 'PM' && endHour !== 12) {
                    endHour24 += 12;
                }

                // Convert to minutes for easy comparison
                const startTimeInMinutes = startHour24 * 60 + startMinute;
                const endTimeInMinutes = endHour24 * 60 + endMinute;

                if (endTimeInMinutes <= startTimeInMinutes) {
                    endHourSelect.classList.add('border-danger', 'is-invalid');
                    endMinuteSelect.classList.add('border-danger', 'is-invalid');
                    endShiftSelect.classList.add('border-danger', 'is-invalid');
                    isValid = false;
                }
            });

            return isValid;
        }
    }
}
</script>

<style>
.add-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    cursor: pointer;
    right: 5%;
    bottom: 5%;
}

.border-bottom {
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid #282A36;
    color: #282A36;
  }
</style>