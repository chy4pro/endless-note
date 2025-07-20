class EndlessNote {
    private container = document.getElementById('notes-container') as HTMLElement;
    private statusElement = document.getElementById('status') as HTMLElement;
    private saveTimeout: number | null = null;

    constructor() {
        this.init();
    }

    private async init(): Promise<void> {
        const notes = await this.loadNotes();
        this.renderNotes(notes);
        this.setupEvents();
    }

    private async loadNotes(): Promise<Array<{date: string, content: string}>> {
        try {
            const response = await fetch('/api/notes');
            const notes = response.ok ? await response.json() : [];
            
            const today = new Date().toISOString().split('T')[0];
            if (!notes.find((n: any) => n.date === today)) {
                notes.push({ date: today, content: '' });
                notes.sort((a: any, b: any) => a.date.localeCompare(b.date));
            }
            return notes;
        } catch {
            return [{ date: new Date().toISOString().split('T')[0], content: '' }];
        }
    }

    private renderNotes(notes: Array<{date: string, content: string}>): void {
        this.container.innerHTML = '';
        
        notes.forEach(note => {
            const separator = Object.assign(document.createElement('div'), {
                className: 'date-separator'
            });
            separator.setAttribute('data-date', note.date);

            const textarea = Object.assign(document.createElement('textarea'), {
                className: 'note-textarea',
                value: note.content,
                placeholder: note.date === new Date().toISOString().split('T')[0] && !note.content ? '开始记录...' : ''
            });
            textarea.dataset.date = note.date;

            textarea.addEventListener('input', () => this.handleTextarea(textarea));
            textarea.addEventListener('blur', () => this.handleBlur(textarea));
            
            this.container.append(separator, textarea);
            this.adjustHeight(textarea);
        });

        (this.container.querySelector('.note-textarea:last-child') as HTMLTextAreaElement)?.focus();
    }

    private handleTextarea(textarea: HTMLTextAreaElement): void {
        this.adjustHeight(textarea);
        this.scheduleSave(textarea);
    }

    private handleBlur(textarea: HTMLTextAreaElement): void {
        const today = new Date().toISOString().split('T')[0];
        if (!textarea.value.trim() && textarea.dataset.date !== today) {
            textarea.previousElementSibling?.remove(); // separator
            textarea.remove();
        }
    }

    private adjustHeight(textarea: HTMLTextAreaElement): void {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    private scheduleSave(textarea: HTMLTextAreaElement): void {
        if (this.saveTimeout) clearTimeout(this.saveTimeout);
        this.saveTimeout = window.setTimeout(() => {
            this.saveNote(textarea.dataset.date!, textarea.value);
        }, 2000);
    }

    private async saveNote(date: string, content: string): Promise<void> {
        try {
            const response = await fetch(`/api/notes/${date}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            
            this.showStatus(response.ok ? '已保存' : '保存失败');
        } catch {
            this.showStatus('服务器不可用');
        }
    }

    private setupEvents(): void {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.container.querySelectorAll<HTMLTextAreaElement>('.note-textarea')
                    .forEach(textarea => this.saveNote(textarea.dataset.date!, textarea.value));
            }
        });

        window.addEventListener('beforeunload', () => {
            this.container.querySelectorAll<HTMLTextAreaElement>('.note-textarea')
                .forEach(textarea => this.saveNote(textarea.dataset.date!, textarea.value));
        });
    }

    private showStatus(message: string): void {
        this.statusElement.textContent = message;
        this.statusElement.classList.add('show');
        setTimeout(() => this.statusElement.classList.remove('show'), 2000);
    }
}

new EndlessNote();