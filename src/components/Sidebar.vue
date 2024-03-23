<template>
    <div class="sidebar shadow h-full col-sm-12 col-md-4 position-absolute p-4" :class="{ 'slide-out': isHidden }" style="z-index: 1000">
        <div class="d-flex justify-content-between align-tems-center">
          <div class="text-left" @click="logout" style="cursor: pointer;">
            Logout
          </div>
          <div class="text-right">
            <svg xmlns="http://www.w3.org/2000/svg" @click="$emit('toggleSidebar')" width="24" height="24" fill="currentColor" class="bi bi-list text-center bg-secondary rounded" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
            </svg>
          </div>
        </div>
        <form @submit.prevent="handleScheduleForm" class="mt-3 text-white">
            <div class="d-flex">
                <!-- <button class="btn btn-success mx-1" type="button" data-toggle="modal" data-target="#addScheduleModal">Add</button> -->
                <vue-select id="select" :options="options" class="form-control p-0 mr-1" v-model="scheduleId"></vue-select>
                <button class="btn btn-success mx-1" type="button" @click="$emit('captureSchedule')">Capture</button>
                <button class="btn btn-danger mx-1" type="button">Delete</button>
            </div>

            <h3 class="my-4">Settings</h3>
            <p v-if="error" class="text-danger m-0">{{ error }}</p>

            <div class="form-group p-0 d-flex justify-content-between align-items-center">
              <label for="schedule-name">Name</label>
              <div>
                <input type="text" class="form-control border-bottom" v-model="schedule.name" id="schedule-name">
              </div>
            </div>

            <div class="form-group m-0 p-0 d-flex justify-content-between align-items-center">
                <label for="background-image">Background Image</label>
                <div>
                    <input type="file" class="d-none" id="background-image" @change="handleFileInputChange" accept="image/*">
                    <label for="background-image" class="image-preview">
                      <img v-if="selectedImage" :src="selectedImage">
                    </label>
                </div>
            </div>

            <div class="form-group p-0 d-flex justify-content-between align-items-center">
                <label for="text-color">Text Color</label>
                <div>
                  <input type="color" class="d-none" v-model="schedule.settings.textColor" id="text-color" @change="handleColorInputChange">
                  <label for="text-color" class="color-preview">
                    <div class="color-box" :style="{ backgroundColor: selectedColor }"></div>
                  </label>
                </div>
            </div>

            <div class="form-group">
                <label for="days-shown">Days Shown</label>
                <div class="">
                    <div v-for="(day, index) in days" :key="index" class="form-check form-check-inline">
                        <input class="form-check-input" :id="'day' + index" type="checkbox" @change="handleDaysShown(index)" :value="day.value" :checked="this.schedule.settings.days[index] > 0 ? true : false">
                        <label class="form-check-label" :for="'day' + index">{{ day.name }}</label>
                    </div>
                </div>
            </div>

            <div class="form-group">
              <div style="display: none;">
                <label for="days-shown">Dimensions</label>
                <div v-for="(dim, index) in dimensions" :key="index" class="form-check my-1">
                  <input class="form-check-input" type="radio" name="dimension" v-model="selectedDimension" @change="handleDimension(dim.width, dim.height)" :id="dim.name" :value="dim.name">
                  <label class="form-check-label" :for="dim.name">
                    {{ dim.name }} ({{ dim.width }} x {{ dim.height }})
                  </label>
                </div>
                <div class="form-check my-1">
                  <input class="form-check-input" type="radio" name="dimension" v-model="selectedDimension" @change="handleDimension(customWidth, customHeight)" id="Custom" value="Custom">
                  <div class="d-flex">
                    <label class="form-check-label" for="Custom">
                      Custom:
                    </label>
                    <input type="number" class="form-control my-0 p-0 mx-3" v-model="customWidth" @change="handleDimension(customWidth, customHeight)" placeholder="Width" name="width">
                    x
                    <input type="number" class="form-control my-0 p-0 mx-3" v-model="customHeight" @change="handleDimension(customWidth, customHeight)" placeholder="Height" name="height">  
                  </div>
                </div>
              </div>
              
              <div class="my-3 text-right d-flex justify-content-end align-items-center">
                <div v-if="loading" class="spinner-border spinner-border-sm text-light mr-2" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <button class="btn btn-success" id="submit-btn" type="submit">Add</button>
              </div>
            </div>
        </form>
    </div>
</template>
  
<script>
import { days, dimensions } from '@/assets/data';
import { addSchedule } from '@/functions';
import { auth } from '../../firebase';

export default {
  name: 'Sidebar',
  props: {
    isHidden: Boolean,
    user: Object,
    schedules: Array,
    schedule: Object,
  },
  emits: ['toggleSidebar', 'scheduleUpdated', 'captureSchedule'],
  data() {
    return {
      scheduleId: null,
      options: this.schedules ? this.schedules.map(schedule => ({ value: schedule.id, label: schedule.name })) : [],
      selectedImage: null,
      selectedColor: '#ccc',
      selectedDimension: 'Current Device',
      customWidth: null,
      customHeight: null,
      error: null,
      loading: false,
      days: days,
      dimensions: dimensions,
    };
  },
  computed: {
    options() {
      return this.schedules ? this.schedules.map(schedule => ({ value: schedule.id, label: schedule.name })) : [];
    }
  },
  watch: {
    scheduleId(newVal) {
      const submitBtn = document.getElementById('submit-btn');
      
      // Check if the new value is in the options array
      if (newVal && this.options.some(option => option.value === newVal.value)) {
        // if the name already exists
        var tempSchedule = this.schedules.find(schedule => schedule.id === newVal.value);
        this.$emit('scheduleUpdated', tempSchedule);
        this.selectedImage = tempSchedule.settings.backgroundImage;
        this.selectedColor = tempSchedule.settings.textColor;
        this.selectedDimension = tempSchedule.settings.dimensions.name;
        
        submitBtn.textContent = 'Save';
        submitBtn.classList.remove('btn-success');
        submitBtn.classList.add('btn-light');
      }else{
        // if the name does not exist, create a new one
        this.$emit('scheduleUpdated', {
          name: '',
          id: null,
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
          classes: []
        });
        this.selectedImage = null;
        this.selectedColor = null;
        this.selectedDimension = 'Current Device';

        submitBtn.textContent = 'Add';
        submitBtn.classList.remove('btn-light');
        submitBtn.classList.add('btn-success');
      }
    },
  },
  methods: {
    handleFileInputChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImage = e.target.result;
          this.schedule.settings.selectedImage = this.selectedImage;
        };
        reader.readAsDataURL(file);

        this.schedule.settings.backgroundImage = file;
       
        this.$emit('scheduleUpdated', this.schedule);
      }
    },
    handleColorInputChange(event) {
      this.selectedColor = event.target.value;
      this.schedule.settings.textColor = event.target.value;
      this.$emit('scheduleUpdated', this.schedule);
    },
    handleDaysShown(index) {
      this.schedule.settings.days[index] = !this.schedule.settings.days[index];
    },
    handleDimension(width, height) {
      this.schedule.settings.dimensions.name = this.selectedDimension;
      this.schedule.settings.dimensions.width = width;
      this.schedule.settings.dimensions.height = height;

      if(this.selectedDimension !== 'Custom') {
        this.customWidth = null;
        this.customHeight = null;
      }

      this.$emit('scheduleUpdated', this.schedule);
    },
    async handleScheduleForm(){
      this.error = null;

      const elements = document.querySelectorAll('.border-danger, .is-invalid, .text-danger');
      elements.forEach(element => {
        if (element.tagName !== 'svg') {
          element.classList.remove('border-danger', 'is-invalid', 'text-danger');
        }   
      });

      if(this.schedule.name === '') {
        this.error = 'Name is required';
        return;
      }

      if(this.schedule.settings.textColor === '') {
        this.error = 'Text Color is required';
        return;
      }

      if(this.schedule.settings.dimensions.width === '' || this.schedule.settings.dimensions.height === '') {
        this.error = 'Dimensions are required';
        return;
      }

      if(this.schedules.some(option => option.name === this.schedule.name && option.id !== this.schedule.id)){
        this.error = 'Name already exists';
        document.getElementById('schedule-name').classList.add('border-danger');
        return;
      }

      try {
        this.loading = true;
        await addSchedule(this.schedule, this.user);
        this.loading = false;
      } catch (error) {
        this.error = error.message;
        this.loading = false;
      }
    },
    logout() {
      auth.signOut()
        .then(() => {
          window.location.href = '/login';
        });
    }
  },
};
</script>
  
<style scoped>
.shadow {
  background-color: #282A36;
  transition: transform 0.3s ease;
}

.slide-out {
  transform: translateX(-100%);
}

svg {
  cursor: pointer;
}

input[type="text"], input[type="number"] {
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid #fff;
  color: #fff;
}

.vs__dropdown-toggle {
  border: none !important;
}

::-ms-input-placeholder {
  /* Edge 12-18 */
  color: #fff;
}

::placeholder {
  color: #fff;
}

.image-preview {
  background-color: #ccc;
  width: 40px;
  height: 40px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.color-preview {
  cursor: pointer;
}

.color-box {
  background-color: #ccc;
  width: 40px;
  height: 40px;
}
</style>
