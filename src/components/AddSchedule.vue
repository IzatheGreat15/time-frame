<template>
    <div class="position-absolute bg-violet add-btn" data-toggle="modal" data-target="#addScheduleModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-plus-lg" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
        </svg>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="addScheduleModal" tabindex="-1" role="dialog" aria-labelledby="addScheduleLabel" aria-hidden="false">
        <div class="modal-dialog" role="document">
        <form @submit.prevent="addScheduleSubmit" class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title text-dark" id="addScheduleLabel">Add Schedule</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
                <div class="text-dark">
                    <div class="form-group">
                        <label for="scheduleName" class="text-md">Schedule Name</label>
                        <input type="text" v-model="schedule.name" class="form-control" id="scheduleName" placeholder="My Schedule">
                        <p v-if="error" id="errorMessage" class="text-danger mt-2" style="font-size: 12px;">{{ error }}</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
            <button type="submit" class="btn bg-violet text-dark">Save</button>
            </div>
        </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddSchedule',
    data() {
        return {
            schedule: {
                name: '',
                settings: {
                    days: [true, true, true, true, true, true, true],
                    dimensions: {
                        name: 'Current Device',
                        width: '100%',
                        height: '100%'
                    },
                    backgroundImage: '',
                    textColor: '#ccc'
                },
            },
            error: null
        }
    },
    props: {
        user: Object,
        schedules: Array
    },
    mounted() {
        $('#addScheduleModal').on('show.bs.modal', this.resetForm);
    },
    beforeDestroy() {
        $('#addScheduleModal').off('show.bs.modal', this.resetForm);
    },
    methods: {
        async addScheduleSubmit() {
            const elements = document.querySelectorAll('.border-danger, .is-invalid, .text-danger');
            elements.forEach(element => {
                if (element.tagName !== 'svg') {
                    element.classList.remove('border-danger', 'is-invalid', 'text-danger');
                }   
            });
            
            this.error = null;

            if (this.schedule.name === '') {
                document.getElementById('scheduleName').classList.add('border-danger', 'is-invalid');
                document.querySelector('label[for="scheduleName"]').classList.add('text-danger');
                this.error = 'Schedule name is required';
                document.getElementById('errorMessage').classList.add('text-danger');
                return;
            }

            //check if the name already exists
            if (this.schedules) {
                const scheduleExists = this.schedules.find(schedule => schedule === this.schedule.name);
                if (scheduleExists) {
                    document.getElementById('scheduleName').classList.add('border-danger', 'is-invalid');
                    document.querySelector('label[for="scheduleName"]').classList.add('text-danger');
                    this.error = 'Schedule name already exists';
                    document.getElementById('errorMessage').classList.add('text-danger');
                    return;
                }
            }
        },
        
        resetForm() {
            const elements = document.querySelectorAll('.border-danger, .is-invalid, .text-danger');
            elements.forEach(element => {
                if (element.tagName !== 'svg') {
                    element.classList.remove('border-danger', 'is-invalid', 'text-danger');
                }   
            });

            this.error = null;

            this.schedule = {
                name: '',
                settings: {
                    days: [true, true, true, true, true, true, true],
                    dimensions: {
                        name: 'Current Device',
                        width: '100%',
                        height: '100%'
                    },
                    backgroundImage: '',
                    textColor: '#ccc'
                },
            };
        }
    }
}
</script>

<style>

</style>