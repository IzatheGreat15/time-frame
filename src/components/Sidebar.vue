<template>
    <div class="sidebar shadow h-full col-sm-12 col-md-4 position-absolute p-4" :class="{ 'slide-out': isHidden }" style="z-index: 1000">
        <div class="text-right">
            <svg xmlns="http://www.w3.org/2000/svg" @click="$emit('toggleSidebar')" width="24" height="24" fill="currentColor" class="bi bi-list text-center" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
            </svg>
        </div>
        <form action="" class="mt-3 text-white">
            <div class="d-flex">
                <input type="text" class="form-control mr-1" placeholder="Schedule Name" name="schedule_name" list="schedules"/>
                <datalist id="schedules">
                    <option value="1st Semester"></option>
                </datalist>

                <a href="#" class="btn btn-success mx-1">Add</a>
                <button class="btn btn-danger mx-1">Delete</button>
            </div>

            <h3 class="my-5">Settings</h3>

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
                  <input type="color" class="d-none" id="text-color" @change="handleColorInputChange">
                  <label for="text-color" class="color-preview">
                    <div class="color-box" :style="{ backgroundColor: selectedColor }"></div>
                  </label>
                </div>
            </div>

            <div class="form-group">
                <label for="days-shown">Days Shown</label>
                <div class="">
                    <div v-for="(day, index) in days" :key="index" class="form-check form-check-inline">
                        <input class="form-check-input" :id="'day' + index" type="checkbox" :value="day.value" v-model="selectedDays">
                        <label class="form-check-label" :for="'day' + index">{{ day.name }}</label>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label for="days-shown">Dimensions</label>
                <div class="">
                    <div class="form-check my-1">
                        <input class="form-check-input" type="radio" name="exampleRadios" id="" value="option1">
                        <label class="form-check-label" for="">
                          Desktop
                        </label>
                    </div>
                    <div class="form-check my-1">
                        <input class="form-check-input" type="radio" name="exampleRadios" id="" value="option1">
                        <label class="form-check-label" for="">
                          Desktop
                        </label>
                    </div>
                    <div class="form-check my-1">
                        <input class="form-check-input" type="radio" name="exampleRadios" id="" value="option1">
                        <div class="d-flex">
                            <label class="form-check-label" for="">
                                Custom:
                            </label>
                            <input type="text" class="form-control my-0 p-0 mx-3" placeholder="Width" name="width">
                            x
                            <input type="text" class="form-control my-0 p-0 mx-3" placeholder="Height" name="height">  
                        </div>
                    </div>

                    <div class="my-3 text-right">
                        <button class="btn btn-light">Save</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
  
<script>
export default {
  name: 'Sidebar',
  props: {
    isHidden: Boolean
  },
  data() {
    return {
      selectedImage: null,
      selectedColor: null,
      days: [
        { name: 'Sun', value: 0 },
        { name: 'Mon', value: 1 },
        { name: 'Tue', value: 2 },
        { name: 'Wed', value: 3 },
        { name: 'Thu', value: 4 },
        { name: 'Fri', value: 5 },
        { name: 'Sat', value: 6 }
      ],
      selectedDays: []
    };
  },
  methods: {
    handleFileInputChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    handleColorInputChange(event) {
      this.selectedColor = event.target.value;
    }
  }
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
svg{
    cursor: pointer;
}
input[type="text"] {
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid #fff;
    color: #fff;
}

::-ms-input-placeholder { /* Edge 12-18 */
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
    max-width: 100%;
    max-height: 100%;
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
