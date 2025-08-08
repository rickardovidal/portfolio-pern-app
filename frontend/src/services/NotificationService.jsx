// src/services/NotificationService.jsx
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Criar instância do SweetAlert2 com suporte React
const MySwal = withReactContent(Swal);

class NotificationService {
    // Configurações globais do SweetAlert2
    static defaultConfig = {
        customClass: {
            popup: 'swal-popup',
            title: 'swal-title',
            content: 'swal-content',
            confirmButton: 'btn btn-primary swal-confirm-btn',
            cancelButton: 'btn btn-outline-secondary swal-cancel-btn',
            denyButton: 'btn btn-danger swal-deny-btn'
        },
        buttonsStyling: false, // Usar estilos Bootstrap
        showClass: {
            popup: 'animate__animated animate__fadeInDown animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp animate__faster'
        }
    };

    // Alerta de sucesso
    static success(title, text = '', options = {}) {
        return MySwal.fire({
            title: title,
            text: text,
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 4000,
            timerProgressBar: true,
            toast: false,
            position: 'center',
            ...this.defaultConfig,
            ...options
        });
    }

    // Alerta de erro
    static error(title, text = '', options = {}) {
        return MySwal.fire({
            title: title,
            text: text,
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 6000,
            timerProgressBar: true,
            toast: false,
            position: 'center',
            ...this.defaultConfig,
            ...options
        });
    }

    // ❌ MÉTODO REMOVIDO - não existe no SweetAlert2
    // static update() não é necessário

    // Alerta de informação (toast por defeito)
    static info(title, text = '', options = {}) {
        return MySwal.fire({
            title: title,
            text: text,
            icon: 'info',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            customClass: {
                popup: 'swal-toast-popup',
                title: 'swal-toast-title'
            },
            ...options
        });
    }

    // Alerta de aviso (toast por defeito)
    static warning(title, text = '', options = {}) {
        return MySwal.fire({
            title: title,
            text: text,
            icon: 'warning',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            customClass: {
                popup: 'swal-toast-popup',
                title: 'swal-toast-title'
            },
            ...options
        });
    }

    // Toast de sucesso (pequeno, canto superior direito)
    static successToast(title, options = {}) {
        return MySwal.fire({
            title: title,
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            customClass: {
                popup: 'swal-toast-popup',
                title: 'swal-toast-title'
            },
            ...options
        });
    }

    // Toast de erro (pequeno, canto superior direito)
    static errorToast(title, options = {}) {
        return MySwal.fire({
            title: title,
            icon: 'error',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            customClass: {
                popup: 'swal-toast-popup',
                title: 'swal-toast-title'
            },
            ...options
        });
    }

    // Confirmação de ação - versão com Promise
    static confirm(title, text = '', confirmText = 'Sim', cancelText = 'Cancelar') {
        return MySwal.fire({
            title: title,
            text: text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            reverseButtons: true,
            focusCancel: true,
            ...this.defaultConfig
        });
    }

    // Confirmação com callbacks (compatibilidade com código antigo)
    static confirmWithCallbacks(title, onConfirm, onCancel = null, text = '') {
        return MySwal.fire({
            title: title,
            text: text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            focusCancel: true,
            ...this.defaultConfig
        }).then((result) => {
            if (result.isConfirmed && onConfirm) {
                onConfirm();
            } else if (result.isDismissed && onCancel) {
                onCancel();
            }
        });
    }

    // Confirmar exclusão (mais específico)
    static confirmDelete(itemName = 'este item') {
        return MySwal.fire({
            title: 'Tens a certeza?',
            text: `Não poderás reverter esta ação! ${itemName} será eliminado permanentemente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, eliminar!',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            focusCancel: true,
            customClass: {
                ...this.defaultConfig.customClass,
                confirmButton: 'btn btn-danger swal-confirm-btn'
            },
            buttonsStyling: false
        });
    }

    // Loading personalizado
    static loading(title = 'A processar...', text = 'Por favor aguarda...') {
        return MySwal.fire({
            title: title,
            text: text,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                MySwal.showLoading();
            },
            customClass: {
                popup: 'swal-loading-popup'
            }
        });
    }

    // Fechar loading
    static closeLoading() {
        MySwal.close();
    }

    // Input personalizado
    static input(title, inputType = 'text', placeholder = '', defaultValue = '') {
        return MySwal.fire({
            title: title,
            input: inputType,
            inputPlaceholder: placeholder,
            inputValue: defaultValue,
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Este campo é obrigatório!';
                }
            },
            ...this.defaultConfig
        });
    }

    // Notificação de atualização bem-sucedida
    static updateSuccess(itemName = 'Item') {
        return this.successToast(`${itemName} atualizado com sucesso!`);
    }

    // Notificação de criação bem-sucedida
    static createSuccess(itemName = 'Item') {
        return this.successToast(`${itemName} criado com sucesso!`);
    }

    // Notificação de eliminação bem-sucedida
    static deleteSuccess(itemName = 'Item') {
        return this.successToast(`${itemName} eliminado com sucesso!`);
    }

    // Erro de rede/servidor
    static networkError() {
        return this.error(
            'Erro de Conexão', 
            'Não foi possível conectar ao servidor. Verifica a tua ligação à internet.'
        );
    }

    // Erro de validação (toast por defeito)
    static validationError(message = 'Por favor, verifica os dados introduzidos.') {
        return this.warning(message);
    }

    // Toast de carregamento simples (apenas informativo)
    static loadingToast(message = 'A carregar...') {
        return this.info(message);
    }

    // Método genérico para casos especiais
    static custom(config) {
        return MySwal.fire({
            ...this.defaultConfig,
            ...config
        });
    }

    // Métodos para alertas grandes (apenas para casos importantes)
    static bigSuccess(title, text = '') {
        return MySwal.fire({
            title: title,
            text: text,
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 4000,
            timerProgressBar: true,
            position: 'center',
            ...this.defaultConfig
        });
    }

    static bigError(title, text = '') {
        return MySwal.fire({
            title: title,
            text: text,
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 6000,
            timerProgressBar: true,
            position: 'center',
            ...this.defaultConfig
        });
    }
}

export default NotificationService;