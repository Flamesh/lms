<template>
	<Dialog v-model="show" :options="{ size: '4xl' }">
		<template #body>
			<div class="flex h-[calc(100vh_-_8rem)]">
				<div class="flex w-52 shrink-0 flex-col bg-surface-gray-2 p-2">
					<h1 class="mb-3 px-2 pt-2 text-lg font-semibold text-ink-gray-9">
						{{ __('Settings') }}
					</h1>
					<div v-for="tab in tabs" :key="tab.label">
						<div
							v-if="!tab.hideLabel"
							class="mb-2 mt-3 flex cursor-pointer gap-1.5 px-1 text-base font-medium text-ink-gray-5 transition-all duration-300 ease-in-out"
						>
							<span>{{ __(tab.label) }}</span>
						</div>
						<nav class="space-y-1">
							<SidebarLink
								v-for="item in tab.items"
								:link="item"
								:key="item.label"
								class="w-full"
								:class="
									activeTab?.label == item.label
										? 'bg-surface-selected shadow-sm'
										: 'hover:bg-surface-gray-2'
								"
								@click="activeTab = item"
							/>
						</nav>
					</div>
				</div>
				<div
					v-if="activeTab && data.doc"
					:key="activeTab.label"
					class="flex flex-1 flex-col px-10 py-8 bg-surface-modal"
				>
					<Members
						v-if="activeTab.label === 'Members'"
						:label="activeTab.label"
						:description="activeTab.description"
						v-model:show="show"
					/>
					<Categories
						v-else-if="activeTab.label === 'Categories'"
						:label="activeTab.label"
						:description="activeTab.description"
					/>
					<PaymentSettings
						v-else-if="activeTab.label === 'Payment Gateway'"
						:label="activeTab.label"
						:description="activeTab.description"
						:data="data"
						:fields="activeTab.fields"
					/>
					<BrandSettings
						v-else-if="activeTab.label === 'Branding'"
						:label="activeTab.label"
						:description="activeTab.description"
						:fields="activeTab.fields"
						:data="branding"
					/>
					<SettingDetails
						v-else
						:fields="activeTab.fields"
						:label="activeTab.label"
						:description="activeTab.description"
						:data="data"
					/>
				</div>
			</div>
		</template>
	</Dialog>
</template>
<script setup>
import { Dialog, createDocumentResource, createResource } from 'frappe-ui'
import { ref, computed, watch } from 'vue'
import { useSettings } from '@/stores/settings'
import SettingDetails from '../SettingDetails.vue'
import SidebarLink from '@/components/SidebarLink.vue'
import Members from '@/components/Members.vue'
import Categories from '@/components/Categories.vue'
import BrandSettings from '@/components/BrandSettings.vue'
import PaymentSettings from '@/components/PaymentSettings.vue'

const show = defineModel()
const doctype = ref('LMS Settings')
const activeTab = ref(null)
const settingsStore = useSettings()

const data = createDocumentResource({
	doctype: doctype.value,
	name: doctype.value,
	fields: ['*'],
	cache: doctype.value,
	auto: true,
})

const branding = createResource({
	url: 'lms.lms.api.get_branding',
	auto: true,
	cache: 'brand',
})

const tabsStructure = computed(() => {
	return [
		{
			label: 'Cài đặt',
			hideLabel: true,
			items: [
				{
					label: 'Chung',
					icon: 'Wrench',
					fields: [
						{
							label: 'Đường dẫn',
							name: 'enable_learning_paths',
							description:
								'Điều này sẽ buộc học viên phải học theo đúng thứ tự các chương trình được chỉ định cho họ.',
							type: 'checkbox',
						},
						{
							label: 'Cho phép người ngoài',
							name: 'allow_guest_access',
							description:
								'Nếu bật, người dùng có thể xem danh sách khóa học và lớp mà không cần đăng nhập.',
							type: 'checkbox',
						},
						{
							label: 'Gửi lời mời lịch cho đánh giá',
							name: 'send_calendar_invite_for_evaluations',
							description:
								'Nếu bật, hệ thống sẽ gửi lời mời Google Calendar cho học viên để tham gia đánh giá.',
							type: 'checkbox',
						},
						{
							label: 'Khóa truy cập Unsplash',
							name: 'unsplash_access_key',
							description:
								'Tùy chọn. Nếu được thiết lập, học viên có thể chọn ảnh bìa từ thư viện Unsplash cho trang cá nhân của họ. https://unsplash.com/documentation#getting-started.',
							type: 'password',
						},
					],
				},
			],
		},
		{
			label: 'Cài đặt',
			hideLabel: true,
			items: [
				{
					label: 'Cổng thanh toán',
					icon: 'DollarSign',
					description:
						'Chọn cổng thanh toán mà bạn muốn sử dụng để thanh toán cho các khóa học.',
					fields: [
						{
							label: 'Cổng thanh toán',
							name: 'payment_gateway',
							type: 'Link',
							doctype: 'Payment Gateway',
						},
						{
							label: 'Mặc định',
							name: 'default_currency',
							type: 'Link',
							doctype: 'Currency',
						},
					],
				},
			],
		},
		{
			label: 'Danh sách',
			hideLabel: false,
			items: [
				{
					label: 'Thành viên',
					description: 'Quản lý các thành viên của hệ thống học tập của bạn',
					icon: 'UserRoundPlus',
				},
				{
					label: 'Danh mục',
					description: 'Quan lý danh mục của hệ thống học tập của bạn',
					icon: 'Network',
				},
			],
		},
		{
			label: 'Tùy chỉnh',
			hideLabel: false,
			items: [
				{
					label: 'Thương hiệu',
					icon: 'Blocks',
					fields: [
						{
							label: 'Tên thương hiệu',
							name: 'app_name',
							type: 'text',
						},
						{
							label: 'Logo',
							name: 'banner_image',
							type: 'Upload',
						},
						{
							label: 'Favicon',
							name: 'favicon',
							type: 'Upload',
						},
						{
							label: 'Logo chân trang',
							name: 'footer_logo',
							type: 'Upload',
						},
						{
							label: 'Địa chỉ',
							name: 'address',
							type: 'textarea',
							rows: 2,
						},
						{
							label: "Chân trang 'Cung cấp bởi'",
							name: 'footer_powered',
							type: 'textarea',
							rows: 4,
						},
						{
							label: 'Bản quyền',
							name: 'copyright',
							type: 'text',
						},
					],
				},
				{
					label: 'Menu',
					icon: 'PanelLeftIcon',
					description: 'Chọn các mục bạn muốn hiển thị trong menu chính',
					fields: [
						{
							label: 'Khóa học',
							name: 'courses',
							type: 'checkbox',
						},
						{
							label: 'Chứng chỉ học viên',
							name: 'certified_participants',
							type: 'checkbox',
						},
						{
							type: 'Column Break',
						},
						{
							label: 'Công việc',
							name: 'jobs',
							type: 'checkbox',
						},
						{
							label: 'Dữ liệu',
							name: 'statistics',
							type: 'checkbox',
						},
						{
							label: 'Thông báo',
							name: 'notifications',
							type: 'checkbox',
						},
					],
				},
				{
					label: 'Mẫu email',
					icon: 'MailPlus',
					fields: [
						{
							label: 'Mẫu xác nhận lớp',
							name: 'batch_confirmation_template',
							doctype: 'Email Template',
							type: 'Link',
						},
						{
							label: 'Mẫu chứng nhận',
							name: 'certification_template',
							doctype: 'Email Template',
							type: 'Link',
						},
						{
							label: 'Mẫu nộp bài tập',
							name: 'assignment_submission_template',
							doctype: 'Email Template',
							type: 'Link',
						},
					],
				},
				{
					label: 'Đăng ký',
					icon: 'LogIn',
					fields: [
						{
							label: 'Nội dung tùy chỉnh',
							name: 'custom_signup_content',
							type: 'Code',
							mode: 'htmlmixed',
							rows: 10,
						},
						{
							label: 'Hỏi về nghề nghiệp',
							name: 'user_category',
							type: 'checkbox',
							description:
								'Bật tùy chọn này để yêu cầu người dùng chọn nghề nghiệp của họ trong quá trình đăng ký.',
						},
					],
				},
			],
		},
	]
})

const tabs = computed(() => {
	return tabsStructure.value.map((tab) => {
		return {
			...tab,
			items: tab.items.filter((item) => {
				return !item.condition || item.condition()
			}),
		}
	})
})

watch(show, async () => {
	if (show.value) {
		const currentTab = await tabs.value
			.flatMap((tab) => tab.items)
			.find((item) => item.label === settingsStore.activeTab)
		activeTab.value = currentTab || tabs.value[0].items[0]
	} else {
		activeTab.value = null
		settingsStore.isSettingsOpen = false
	}
})
</script>
