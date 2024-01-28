<template>
    <div class="position-absolute bg-violet add-btn" data-toggle="modal" data-target="#addClassModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-plus-lg" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
        </svg>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="addClassModal" tabindex="-1" role="dialog" aria-labelledby="addClassLabel" aria-hidden="false">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title text-dark" id="addClassLabel">Add Class</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
                <form action="" class="text-dark">
                    <div class="form-group">
                        <label for="class-name" class="text-md">Class Name</label>
                        <input type="text" class="form-control border-bottom" id="class-name" placeholder="Biology 101">
                    </div>
                    <div class="form-group">
                        <label for="room" class="text-md">Room</label>
                        <input type="text" class="form-control border-bottom" id="room" placeholder="Room 1423">
                    </div>
                    <div class="form-group">
                        <label for="teacher" class="text-md">Teacher</label>
                        <input type="text" class="form-control border-bottom" id="teacher" placeholder="Mr. Holmes">
                    </div>
                    <div class="form-group">
                        <label for="color" class="text-md">Color</label>
                        <input type="color" class="form-control p-0 border-bottom" id="color" value="#000000">
                    </div>
                    <div class="form-group">
                        <label for="times" class="text-md">Times</label>
                        <div id="times-fields">
                            <Time v-for="(time, index) in times" :key="index" @delete="deleteTime(index)" />
                        </div>
                    </div>
                    
                    <div class="text-center" @click="addTime" style="cursor: pointer">
                        <p>+ Add Time</p>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn bg-violet text-dark">Save changes</button>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import Time from './Time.vue';

export default {
    name: 'AddClass',
    components: {
        Time
    },
    data(){
        return {
            times: []
        }
    },
    methods: {
        addTime() {
            this.times.push({});
        },
        deleteTime(index) {
            console.log('here at ', index)
            this.times.splice(index, 1);
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