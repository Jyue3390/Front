<template>
  <div class="home">
    <h1>欢迎来到首页</h1>

    <!-- Magnifying Glass Icon -->
    <div class="search-icon" @click="toggleSearchBox">
      <i class="fas fa-search" />
    </div>

    <!-- Search Box -->
    <div v-if="showSearchBox" class="search-box">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="搜索图片"
        @input="filterImages"
      >
    </div>

    <!-- Image Grid -->
    <div class="image-grid">
      <div
        v-for="(image, index) in filteredImages"
        v-if="filteredImages.length > 0"
        :key="index"
        class="image-item"
      >
        <div class="image">
          <img :src="image.src" alt="图片">
          <div class="image-content">
            <h1>{{ image.title }}</h1>
            <div class="icons">
              <a href="#" class="icon fas fa-heart" />
              <a href="#" class="icon fas fa-comment" />
              <a href="#" class="icon fas fa-share" />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-content">
        <p>无相关内容</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      images: [
        { src: require('@/assets/img/i1.jpg'), title: '图片1' },
        { src: require('@/assets/img/i2.jpg'), title: '图片2' },
        { src: require('@/assets/img/i3.jpg'), title: '图片3' },
        { src: require('@/assets/img/i4.jpg'), title: '图片4' },
        { src: require('@/assets/img/i5.jpg'), title: '图片5' },
        { src: require('@/assets/img/i6.jpg'), title: '图片6' },
        { src: require('@/assets/img/i7.jpg'), title: '图片7' },
        { src: require('@/assets/img/i8.jpg'), title: '图片8' },
        { src: require('@/assets/img/i9.jpg'), title: '图片9' }
      ],
      showSearchBox: false,
      searchTerm: '',
      filteredImages: []
    }
  },
  mounted() {
    this.filteredImages = this.images // Initially show all images
  },
  methods: {
    toggleSearchBox() {
      this.showSearchBox = !this.showSearchBox
      if (!this.showSearchBox) {
        this.searchTerm = ''
        this.filteredImages = this.images // Reset to show all images when search box is closed
      }
    },
    filterImages() {
      if (this.searchTerm.trim() === '') {
        this.filteredImages = this.images // Show all images if search is cleared
      } else {
        this.filteredImages = this.images.filter((image) =>
          image.title.includes(this.searchTerm)
        )
      }
    }
  }
}
</script>

<style scoped>
/* Home layout styles */
.home {
  padding: 20px;
  background-color: #f0f0f0;
  height: 100vh;
  position: relative;
  /* 移除滚动条样式 */
  overflow: unset;
}

.home::-webkit-scrollbar {
  display: none; /* 去掉滚动条 */
}

/* Magnifying glass icon */
.search-icon {
  position: absolute;
  top: 20px;
  left: 20px;
  cursor: pointer;
  font-size: 24px;
  color: #333;
}

/* Search Box Styles */
.search-box {
  position: absolute;
  top: 20px;
  left: 60px;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 200px;
}

.search-box input {
  width: 100%;
  padding: 5px;
  font-size: 16px;
}

/* No Content Styles */
.no-content {
  text-align: center;
  color: #999;
  font-size: 18px;
  padding: 20px;
  width: 100%;
}

/* Image Grid */
.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 三列布局 */
  gap: 10px;
}

/* 鼠标悬停时显示滚动条 */
.home:hover {
  overflow-y: auto; /* 恢复滚动功能 */
}

/* 滚动条样式 */
.home::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
  background: transparent; /* 默认背景透明 */
}

.home:hover::-webkit-scrollbar {
  background: #e0e0e0; /* 鼠标悬停时显示背景 */
}

.home::-webkit-scrollbar-thumb {
  background: #888; /* 滑块颜色 */
  border-radius: 4px;
}

.home:hover::-webkit-scrollbar-thumb {
  background: #555; /* 鼠标悬停时滑块颜色 */
}

h1 {
  text-align: center;
  color: #333;
}

.image-item {
  overflow: hidden;
  cursor: pointer;
}

/* Image hover effect styles */
.image {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.image img {
  width: 100%;
  display: block;
  transition: transform 0.5s ease-in-out;
}

.image:hover img {
  transform: scale(1.1); /* 放大效果 */
}

.image-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.5); /* 背景遮罩 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform: translateY(100%);
  transition: transform 0.5s ease-in-out;
}

.image:hover .image-content {
  transform: translateY(0); /* 内容上滑显示 */
}

.image-content h1 {
  color: #fff;
  text-transform: uppercase;
  transform: translateY(20px);
  transition: transform 0.4s;
}

.image:hover .image-content h1 {
  transform: translateY(0);
}

.icons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.icon {
  text-decoration: none;
  color: #fff;
  font-size: 22px;
  margin: 0 10px;
  transform: translateY(80px);
  transition: transform 0.4s ease-in-out, color 0.4s;
}

.image:hover .icon {
  transform: translateY(0);
}

.icon:nth-child(1) {
  transition: transform 0.4s 0.05s, color 0.4s;
}

.icon:nth-child(2) {
  transition: transform 0.4s 0.1s, color 0.4s;
}

.icon:nth-child(3) {
  transition: transform 0.4s 0.15s, color 0.4s;
}

.icon:hover {
  color: #3498db;
}

.image-content::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  width: 100%;
  height: 0px;
  clip-path: polygon(0 100%, 100% 0, 100% 100%);
  transition: 0.5s;
}

.image:hover .image-content::before {
  height: 140px;
}
</style>
