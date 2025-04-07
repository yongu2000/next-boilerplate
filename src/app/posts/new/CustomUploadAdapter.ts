import { imageService } from '@/services/image';

class CustomUploadAdapter {
	private loader: any;

	constructor(loader: any) {
		this.loader = loader;
	}

	async upload() {
		try {
			const file = await this.loader.file;
			const imageUrl = await imageService.uploadImage(file);
			
			// 개발 환경에서는 localhost:8080, 프로덕션에서는 실제 도메인으로 변경 필요
			const fullImageUrl = `http://localhost:8080${imageUrl}`;
			
			return {
				default: fullImageUrl
			};
		} catch (error) {
			console.error('Upload failed:', error);
			throw error;
		}
	}

	abort() {
		// 업로드 중단 처리
	}
}

export default function CustomUploadAdapterPlugin(editor: any) {
	editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
		return new CustomUploadAdapter(loader);
	};
} 