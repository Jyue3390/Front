<template>
  <div class="album-detail">
    <h1>{{ album.name }} 相册</h1>

    <!-- Display album images -->
    <div class="image-grid">
      <div
        v-for="(image, index) in album.images"
        :key="index"
        class="image-item"
      >
        <div class="image">
          <img :src="image" alt="Image">
        </div>
        <!-- Delete Image Button -->
        <button class="delete-btn" @click="deleteImage(index)">删除</button>
      </div>

      <!-- Add new image button -->
      <div class="image-item add-image" @click="triggerUpload">
        <div class="image">
          <img src="/img/plus-icon.png" alt="Add Image">
        </div>
      </div>
    </div>

    <!-- Hidden file input for image upload -->
    <input ref="fileInput" type="file" style="display: none" @change="handleFileUpload">
  </div>
</template>

<script>
export default {
  name: 'AlbumDetail',
  data() {
    return {
      album: { name: '', images: [], coverImage: '' } // 相册数据
    }
  },
  created() {
    const albumId = this.$route.params.albumId
    // 从本地存储或者模拟获取相册数据
    const album = JSON.parse(localStorage.getItem('albums') || '[]').find(
      (album) => album.id === parseInt(albumId)
    )
    if (album) {
      this.album = album
    } else {
      console.error('Album not found')
    }
  },
  methods: {
    // Trigger the hidden file input to upload image
    triggerUpload() {
      this.$refs.fileInput.click()
    },

    // Handle file upload and add image to the album
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          // Add the uploaded image to the album's images array
          this.album.images.push(e.target.result)

          // If it's the first image, set it as the cover
          if (this.album.images.length === 1) {
            this.album.coverImage = e.target.result
          }

          // Update album data in localStorage
          this.updateAlbum()
        }
        reader.readAsDataURL(file)
      }
    },

    // Delete an image from the album
    deleteImage(index) {
      if (index >= 0 && index < this.album.images.length) {
        // Remove the image from the images array
        this.album.images.splice(index, 1)

        // If the deleted image was the cover, update the cover
        if (this.album.coverImage === this.album.images[index]) {
          // Set the first image as the new cover
          this.album.coverImage = this.album.images[0] || '' // If no images left, reset the cover
        }

        // Update album data in localStorage
        this.updateAlbum()
      }
    },

    // Update the album data in localStorage
    updateAlbum() {
      const albums = JSON.parse(localStorage.getItem('albums') || '[]')
      const albumIndex = albums.findIndex(
        (album) => album.id === this.album.id
      )
      if (albumIndex !== -1) {
        albums[albumIndex] = this.album
        localStorage.setItem('albums', JSON.stringify(albums))
      }
    }
  }
}
</script>

<style scoped>
.album-detail {
  padding: 30px;
  background-color: #f8f8f8;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  height: 100vh; /* Set the height to 100vh */
  overflow-y: auto; /* Enable vertical scrolling */
}

h1 {
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.image-item {
  position: relative;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.image-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
}

.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 0, 0, 0.6);
  color: white;
  border: none;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: rgba(255, 0, 0, 1);
}

.add-image {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ecf0f1;
  border: 2px dashed #ccc;
}

.add-image img {
  width: 50px;
  height: 50px;
}

.add-image:hover {
  background-color: #bdc3c7;
}

input[type="file"] {
  display: none;
}
</style>
