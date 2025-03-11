<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artPublishService, artGetDetailService, artEditService } from '@/api/article.js'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request.js'
import axios from 'axios'
const visibleDraw = ref(false)
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: '',
}
const formModel = ref({
  ...defaultForm,
})
const imgUrl = ref('')
const editorRef = ref()
const emit = defineEmits(['success'])

const open = async (row) => {
  visibleDraw.value = true
  if (row.id) {
    // console.log('bianjizhiqianshuju')
    const res = await artGetDetailService(row.id)
    console.log(res.data)
    formModel.value = res.data.data
    imgUrl.value = baseURL + formModel.value.cover_img
    const file = imageUrlToFileObject(imgUrl.value, formModel.value.cover_img)

    formModel.value.cover_img = file
  } else {
    formModel.value = { ...defaultForm }
    imgUrl.value = ''
    editorRef.value.setHTML('')
  }
  console.log(row)
}
const onSelectFile = (uploadFile) => {
  console.log(uploadFile)
  imgUrl.value = URL.createObjectURL(uploadFile.raw) //前段渲染图片
  formModel.value.cover_img = uploadFile.raw
}

const onPublish = async (state) => {
  formModel.value.state = state
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  if (formModel.value.id) {
    // 编辑操作
    await artEditService(fd)
    ElMessage.success('修改成功')
    visibleDraw.value = false
    emit('success', 'edit')
  } else {
    // 添加操作
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDraw.value = false
    // 通知到父组件，添加成功了
    emit('success', 'add')
  }
}

//网络图片地址转换为 File 对象的函数
async function imageUrlToFileObject(imageUrl, filename) {
  try {
    // 使用 Axios 下载图片数据
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

    // 将下载的数据转换成 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    })

    // 创建 File 对象
    const file = new File([blob], filename, {
      type: response.headers['content-type'],
    })

    return file
  } catch (error) {
    console.error('Error converting image URL to File object:', error)
    return null
  }
}

defineExpose({
  open,
})
</script>
<template>
  <el-drawer
    v-model="visibleDraw"
    title="添加文章"
    :direction="direction"
    :before-close="handleClose"
    size="50%"
  >
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select v-model="formModel.cate_id" width="100%"></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
