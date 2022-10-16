class Tasks {

    static async getTasksList() {
		const response = await fetch('http://localhost:3000/api/tasks');

		return await response.json();
    }

	static async addTask(newTask) {
		const response = await fetch('http://localhost:3000/api/task', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newTask)
		});

		return await response.json();
	}

	static async getTask(id) {
		const response = await fetch(`http://localhost:3000/api/task/${id}`);

		return await response.json();
	}

	static async removeTask(id) {
		await fetch(`http://localhost:3000/api/task/${id}`, {
			method: 'DELETE'
		});
	}

	static async clearTasksList() {
		await fetch('http://localhost:3000/api/task', {
			method: 'DELETE'
		});
	}

	static async editTask(updatedTask) {
		await fetch(`http://localhost:3000/api/task/${updatedTask.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updatedTask)
		});
	}

	static async editTaskStatus(updatedStatus) {
		await fetch('http://localhost:3000/api/tasks', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updatedStatus)
		});
	}
}

export default Tasks;