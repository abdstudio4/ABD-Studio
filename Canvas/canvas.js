 // --- Initialize Fabric.js Canvas ---
    const canvas = new fabric.Canvas('proCanvas', {
        width: 900,
        height: 600,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true // Objects select karne par peeche na jayen
    });

    // Setup for High-DPI screens
    fabric.devicePixelRatio = window.devicePixelRatio || 1;

    // --- State Variables & UI References ---
    let isDrawingMode = false;
    const fillPicker = document.getElementById('fillPicker');
    const strokePicker = document.getElementById('strokePicker');
    const brightnessSlider = document.getElementById('brightness');
    const contrastSlider = document.getElementById('contrast');
    const cropMenu = document.getElementById('crop-menu');
    let currentImgObj = null; // Filter apply karne ke liye image reference

    // --- Core Functionality ---

    // 1. Drawing Mode
    function toggleDrawing() {
        isDrawingMode = true;
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = strokePicker.value;
        canvas.freeDrawingBrush.width = 5;
        setActiveBtn('drawBtn');
    }

    function toggleSelect() {
        isDrawingMode = false;
        canvas.isDrawingMode = false;
        setActiveBtn('selectBtn');
    }

    function setActiveBtn(activeId) {
        document.getElementById('drawBtn').classList.remove('active');
        document.getElementById('selectBtn').classList.remove('active');
        document.getElementById(activeId).classList.add('active');
    }

    // Update colors when pickers change
    fillPicker.onchange = () => {
        const active = canvas.getActiveObject();
        if (active) active.set('fill', fillPicker.value);
        canvas.renderAll();
    };
    strokePicker.onchange = () => {
        const active = canvas.getActiveObject();
        if (isDrawingMode) canvas.freeDrawingBrush.color = strokePicker.value;
        if (active) active.set('stroke', strokePicker.value);
        canvas.renderAll();
    };


    // 2. Add Shapes (Rect, Circle, Triangle)
    function addRect() {
        const rect = new fabric.Rect({
            left: 100, top: 100,
            fill: fillPicker.value,
            stroke: strokePicker.value,
            strokeWidth: 2,
            width: 150, height: 100,
            cornerColor: varColor('--accent'), cornerSize: 10, transparentCorners: false
        });
        canvas.add(rect).setActiveObject(rect);
        toggleSelect();
    }

    function addCircle() {
        const circle = new fabric.Circle({
            left: 150, top: 150,
            fill: fillPicker.value,
            stroke: strokePicker.value,
            strokeWidth: 2,
            radius: 75,
            cornerColor: varColor('--accent'), cornerSize: 10, transparentCorners: false
        });
        canvas.add(circle).setActiveObject(circle);
        toggleSelect();
    }

    function addTriangle() {
        const tri = new fabric.Triangle({
            left: 200, top: 200,
            fill: fillPicker.value,
            stroke: strokePicker.value,
            strokeWidth: 2,
            width: 150, height: 150,
            cornerColor: varColor('--accent'), cornerSize: 10, transparentCorners: false
        });
        canvas.add(tri).setActiveObject(tri);
        toggleSelect();
    }

    function addText() {
        const text = new fabric.IText('Double click to edit', {
            left: 100, top: 100,
            fill: strokePicker.value,
            fontSize: 30,
            fontFamily: 'Segoe UI'
        });
        canvas.add(text).setActiveObject(text);
        toggleSelect();
    }


    // 3. Image Loading & Editing (Filters & Crop)
    document.getElementById('imageLoader').onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            fabric.Image.fromURL(event.target.result, function(img) {
                // Scale image to fit canvas
                img.scaleToWidth(canvas.width / 2);
                img.set({
                    left: canvas.width / 4, top: canvas.height / 4,
                    cornerColor: varColor('--accent'), cornerSize: 12, transparentCorners: false
                });
                canvas.add(img).setActiveObject(img);
                canvas.renderAll();
            });
        };
        reader.readAsDataURL(file);
    };

    // Filters (Brightness & Contrast)
    function applyFilter(index, filter) {
        if (!currentImgObj) return;
        currentImgObj.filters[index] = filter;
        currentImgObj.applyFilters();
        canvas.renderAll();
    }

    brightnessSlider.oninput = function() {
        applyFilter(0, new fabric.Image.filters.Brightness({ brightness: parseFloat(this.value) }));
    };

    contrastSlider.oninput = function() {
        applyFilter(1, new fabric.Image.filters.Contrast({ contrast: parseFloat(this.value) }));
    };


    // Image Selection Handling (Enable filters & Right-Click Menu)
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', function() {
        currentImgObj = null;
        brightnessSlider.disabled = true;
        contrastSlider.disabled = true;
        cropMenu.style.display = 'none';
    });

    function handleSelection(e) {
        const selected = e.selected[0];
        if (selected && selected.type === 'image') {
            currentImgObj = selected;
            brightnessSlider.disabled = false;
            contrastSlider.disabled = false;
            
            // Set slider values based on current filters
            brightnessSlider.value = selected.filters[0] ? selected.filters[0].brightness : 0;
            contrastSlider.value = selected.filters[1] ? selected.filters[1].contrast : 0;
        } else {
            currentImgObj = null;
            brightnessSlider.disabled = true;
            contrastSlider.disabled = true;
        }
    }

    // Right-Click Context Menu for Crop
    canvas.on('mouse:down', function(options) {
        if (options.button === 3 && currentImgObj) { // Right click
            cropMenu.style.display = 'block';
            cropMenu.style.left = options.e.clientX + 'px';
            cropMenu.style.top = options.e.clientY + 'px';
        } else {
            cropMenu.style.display = 'none';
        }
    });

    // Simple Crop Implementation
    function startCrop() {
        if (!currentImgObj) return;
        cropMenu.style.display = 'none';
        
        // Fabric.js mein professional cropping complex hai, yeh basic 'viewbox' crop hai.
        const width = prompt("Enter new width:", currentImgObj.width / 2);
        const height = prompt("Enter new height:", currentImgObj.height / 2);
        
        if(width && height) {
            currentImgObj.set({
                width: parseInt(width),
                height: parseInt(height),
                cropX: 0, cropY: 0 // Start crop from top-left
            });
            canvas.renderAll();
        }
    }


    // 4. General Actions (Clear, Delete, Save)
    function clearCanvas() {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
    }

    function deleteSelected() {
        const active = canvas.getActiveObjects();
        if (active) {
            active.forEach(obj => canvas.remove(obj));
            canvas.discardActiveObject().renderAll();
        }
    }

    function saveCanvas() {
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2 // Save in double resolution (High quality)
        });
        const link = document.createElement('a');
        link.download = 'js-pro-design.png';
        link.href = dataURL;
        link.click();
    }

    // Helper: CSS Variable color lena
    function varColor(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    // Keyboard support (Delete key)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Delete') deleteSelected();
    });

    // Disable default browser right-click context menu on canvas
    document.querySelector('.canvas-container').addEventListener('contextmenu', e => e.preventDefault());