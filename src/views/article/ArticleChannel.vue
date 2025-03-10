<script setup>
import { ref } from 'vue'
import { artGetChannelsService, artDelChannelService } from '@/api/article.js'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const channelList = ref([])
const loading = ref(false)
const dialog = ref()
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
  console.log(res.data.data)
}
getChannelList()

const onEditChannel = (row) => {
  dialog.value.open(row)
}
const onDeleteChannel = async (row) => {
  await ElMessageBox.confirm('你确认要删除吗', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
const onAddChannel = () => {
  dialog.value.open({})
}
const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel"> 添加分类 </el-button>
    </template>
    <el-table :data="channelList" style="width: 100%" v-loading="loading">
      <el-table-column prop="date" label="序号" width="100" type="index" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cata_alias" label="分类别名" />
      <el-table-column prop="address" label="操作" width="100">
        <template #default="{ row }">
          <el-button @click="onEditChannel(row)" :icon="Edit" circle type="primary" plain>
          </el-button>
          <el-button @click="onDeleteChannel(row)" :icon="Delete" circle type="danger" plain>
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"> </el-empty>
      </template>
    </el-table>

    <!--  -->
    <channel-edit ref="dialog" @success="onSuccess"> </channel-edit>
  </page-container>
</template>
<style></style>
