frappe.provide('standard_touch');

// --- 1. Global Message Renderer ---
frappe.router.on('change', () => {
    // Delay slightly to ensure DOM is ready
    setTimeout(() => {
        frappe.call({
            method: 'standard_touch.api.get_active_messages',
            callback: function(r) {
                if (r.message) {
                    const current_route = frappe.get_route_str();
                    r.message.forEach(msg => {
                        if (!msg.route || current_route.startsWith(msg.route) || msg.route === current_route) {
                            render_message(msg);
                        }
                    });
                }
            }
        });
    }, 500);
});

function render_message(msg) {
    const msg_id = 'st-msg-' + msg.name.replace(/[^a-zA-Z0-9]/g, '-');
    if ($('#' + msg_id).length > 0) return;

    const $target = $(msg.css_selector);
    if ($target.length === 0) return;

    let content = msg.message;
    if (msg.display_type === 'Riding Text (Marquee)') {
        content = `<marquee scrollamount="6">${msg.message}</marquee>`;
    }

    const $msg_box = $(`<div id="${msg_id}" class="standard-touch-message">
        ${content}
    </div>`).css({
        'background-color': msg.background_color,
        'color': msg.text_color,
        'padding': '10px',
        'margin': '10px 0',
        'border-radius': '4px',
        'box-shadow': '0 2px 4px rgba(0,0,0,0.1)',
        'z-index': '999',
        'font-weight': 'bold',
        'position': 'relative'
    });

    if (msg.placement === 'Inside - Start') {
        $target.prepend($msg_box);
    } else if (msg.placement === 'Inside - End') {
        $target.append($msg_box);
    } else if (msg.placement === 'Before') {
        $target.before($msg_box);
    } else if (msg.placement === 'After') {
        $target.after($msg_box);
    }
}

// --- 2. Element Picker Logic ---
frappe.ui.form.on('Standard Touch Message', {
    refresh: function(frm) {
        frm.fields_dict.pick_element_button.$wrapper.find('#btn-pick-element').on('click', function(e) {
            e.preventDefault();
            start_element_picker(frm);
        });
    }
});

function start_element_picker(frm) {
    frappe.show_alert({message: 'Hover over an element and click to select it. Press ESC to cancel.', indicator: 'info'});
    
    const overlay_style = `
        <style id="st-picker-style">
            .st-hovered-element {
                outline: 2px dashed var(--blue-500) !important;
                background-color: rgba(36, 144, 239, 0.1) !important;
                cursor: crosshair !important;
            }
        </style>
    `;
    $('head').append(overlay_style);

    let current_hover = null;

    function on_mousemove(e) {
        if (current_hover) {
            $(current_hover).removeClass('st-hovered-element');
        }
        current_hover = e.target;
        $(current_hover).addClass('st-hovered-element');
    }

    function on_click(e) {
        e.preventDefault();
        e.stopPropagation();
        
        let selector = get_unique_selector(e.target);
        cleanup();
        
        frappe.confirm(`Selected space: <b>${selector}</b><br>Do you want to use this?`, () => {
            frm.set_value('css_selector', selector);
        }, () => {
            frappe.show_alert('Selection cancelled.');
        });
    }

    function on_keydown(e) {
        if (e.key === 'Escape') {
            cleanup();
            frappe.show_alert('Element picker cancelled.');
        }
    }

    function cleanup() {
        if (current_hover) {
            $(current_hover).removeClass('st-hovered-element');
        }
        $('#st-picker-style').remove();
        document.removeEventListener('mousemove', on_mousemove, true);
        document.removeEventListener('click', on_click, true);
        document.removeEventListener('keydown', on_keydown, true);
    }

    document.addEventListener('mousemove', on_mousemove, true);
    document.addEventListener('click', on_click, true);
    document.addEventListener('keydown', on_keydown, true);
}

function get_unique_selector(el) {
    if (el.id) {
        return '#' + el.id;
    }
    let selector = el.tagName.toLowerCase();
    if (el.className && typeof el.className === 'string') {
        const classes = el.className.split(' ').filter(c => c && !c.includes('st-hovered-element')).map(c => '.' + c).join('');
        if (classes) {
            selector += classes;
        }
    }
    return selector;
}
