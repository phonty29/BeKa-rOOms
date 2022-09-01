import { v4 } from 'uuid';
import path from 'path';

class FileService {
	download(file) {
		try {
			let name = v4() + '.jpg';
			let picPath = path.resolve('files/storage', name);
			file.mv(picPath);
			return name;
		} catch(e) {
			console.log(e);
		}
	}
}

export default new FileService();