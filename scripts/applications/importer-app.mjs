/**
 * Importer Application
 * AppV2 dialog for importing calendars from external sources.
 *
 * @module Applications/ImporterApp
 * @author Tyler
 */

import { MODULE, TEMPLATES } from '../constants.mjs';
import { log } from '../utils/logger.mjs';
import { getImporterOptions, createImporter } from '../importers/index.mjs';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Calendar Importer Application.
 * Provides UI for selecting an import source, loading data, previewing, and importing.
 * @extends ApplicationV2
 * @mixes HandlebarsApplicationMixin
 */
export class ImporterApp extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @override */
  static DEFAULT_OPTIONS = {
    id: 'calendaria-importer',
    classes: ['calendaria', 'importer-app'],
    tag: 'form',
    window: {
      icon: 'fas fa-file-import',
      title: 'CALENDARIA.Importer.Title',
      resizable: true
    },
    position: { width: 500, height: 'auto' },
    form: {
      handler: ImporterApp.#onSubmit,
      submitOnChange: false,
      closeOnSubmit: false
    },
    actions: {
      selectSource: ImporterApp.#onSelectSource,
      uploadFile: ImporterApp.#onUploadFile,
      importFromModule: ImporterApp.#onImportFromModule,
      clearData: ImporterApp.#onClearData
    }
  };

  /** @override */
  static PARTS = {
    form: { template: TEMPLATES.IMPORTER.APP, scrollable: [''] }
  };

  /* -------------------------------------------- */
  /*  Instance Properties                         */
  /* -------------------------------------------- */

  /** @type {string|null} Currently selected importer ID */
  #selectedImporterId = null;

  /** @type {object|null} Raw data from source */
  #rawData = null;

  /** @type {object|null} Transformed calendar data */
  #transformedData = null;

  /** @type {object|null} Preview summary */
  #previewData = null;

  /** @type {string|null} Suggested calendar ID */
  #suggestedId = null;

  /** @type {string|null} Error message to display */
  #errorMessage = null;

  /** @type {boolean} Whether import is in progress */
  #importing = false;

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    // Get available importers
    const importers = getImporterOptions();
    context.importers = importers;
    context.hasImporters = importers.length > 0;

    // Current state
    context.selectedImporterId = this.#selectedImporterId;
    context.selectedImporter = importers.find((i) => i.value === this.#selectedImporterId);
    context.hasData = !!this.#transformedData;
    context.previewData = this.#previewData;
    context.suggestedId = this.#suggestedId;
    context.errorMessage = this.#errorMessage;
    context.importing = this.#importing;

    // Determine available actions
    if (context.selectedImporter) {
      context.canUpload = context.selectedImporter.supportsFileUpload;
      context.canImportFromModule = context.selectedImporter.supportsLiveImport && context.selectedImporter.detected;
      context.fileExtensions = this.#getSelectedImporter()?.constructor.fileExtensions?.join(',') || '.json';
    }

    // Footer button
    context.buttons = [{ type: 'submit', icon: 'fas fa-file-import', label: 'CALENDARIA.Importer.Import', disabled: !context.hasData || this.#importing }];

    return context;
  }

  /** @override */
  _onRender(context, options) {
    super._onRender?.(context, options);

    // Set up drag and drop for file upload
    const dropZone = this.element.querySelector('.file-upload-zone');
    if (dropZone) {
      dropZone.addEventListener('dragover', this.#onDragOver.bind(this));
      dropZone.addEventListener('dragleave', this.#onDragLeave.bind(this));
      dropZone.addEventListener('drop', this.#onDrop.bind(this));
    }

    // File input change handler
    const fileInput = this.element.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.addEventListener('change', this.#onFileSelected.bind(this));
    }
  }

  /* -------------------------------------------- */
  /*  Helpers                                     */
  /* -------------------------------------------- */

  /**
   * Get the currently selected importer instance.
   * @returns {BaseImporter|null}
   */
  #getSelectedImporter() {
    if (!this.#selectedImporterId) return null;
    return createImporter(this.#selectedImporterId);
  }

  /**
   * Process loaded data through the importer.
   * @param {object} data - Raw source data
   */
  async #processData(data) {
    const importer = this.#getSelectedImporter();
    if (!importer) return;

    this.#errorMessage = null;

    try {
      // Transform data
      this.#rawData = data;
      this.#transformedData = await importer.transform(data);

      // Validate
      const validation = importer.validate(this.#transformedData);
      if (!validation.valid) {
        this.#errorMessage = validation.errors.join('\n');
        this.#transformedData = null;
        this.#previewData = null;
        this.render();
        return;
      }

      // Generate preview
      this.#previewData = importer.getPreviewData(this.#rawData, this.#transformedData);
      this.#suggestedId = this.#generateId(this.#transformedData.name);

      log(3, 'Data processed successfully:', this.#previewData);
    } catch (error) {
      log(2, 'Error processing import data:', error);
      this.#errorMessage = error.message;
      this.#transformedData = null;
      this.#previewData = null;
    }

    this.render();
  }

  /**
   * Generate a suggested calendar ID from name.
   * @param {string} name - Calendar name
   * @returns {string}
   */
  #generateId(name) {
    if (!name) return `imported-${Date.now()}`;
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 32);
  }

  /**
   * Clear all loaded data.
   */
  #clearData() {
    this.#rawData = null;
    this.#transformedData = null;
    this.#previewData = null;
    this.#suggestedId = null;
    this.#errorMessage = null;
  }

  /* -------------------------------------------- */
  /*  Drag & Drop Handlers                        */
  /* -------------------------------------------- */

  /**
   * Handle dragover event on drop zone.
   * @param {DragEvent} event
   */
  #onDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
  }

  /**
   * Handle dragleave event on drop zone.
   * @param {DragEvent} event
   */
  #onDragLeave(event) {
    event.currentTarget.classList.remove('dragover');
  }

  /**
   * Handle drop event on drop zone.
   * @param {DragEvent} event
   */
  async #onDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');

    const file = event.dataTransfer?.files?.[0];
    if (file) await this.#handleFile(file);
  }

  /**
   * Handle file input selection.
   * @param {Event} event
   */
  async #onFileSelected(event) {
    const file = event.target.files?.[0];
    if (file) await this.#handleFile(file);
  }

  /**
   * Process an uploaded file.
   * @param {File} file
   */
  async #handleFile(file) {
    const importer = this.#getSelectedImporter();
    if (!importer) {
      ui.notifications.warn(game.i18n.localize('CALENDARIA.Importer.SelectSourceFirst'));
      return;
    }

    try {
      const data = await importer.parseFile(file);
      await this.#processData(data);
    } catch (error) {
      log(2, 'Error parsing file:', error);
      this.#errorMessage = game.i18n.format('CALENDARIA.Importer.ParseError', { error: error.message });
      this.render();
    }
  }

  /* -------------------------------------------- */
  /*  Action Handlers                             */
  /* -------------------------------------------- */

  /**
   * Handle source selection change.
   * @param {Event} event
   * @param {HTMLElement} target
   */
  static async #onSelectSource(event, target) {
    const select = this.element.querySelector('select[name="importerId"]');
    const importerId = select?.value;

    if (importerId !== this.#selectedImporterId) {
      this.#selectedImporterId = importerId || null;
      this.#clearData();
      this.render();
    }
  }

  /**
   * Handle upload file button click.
   * @param {Event} event
   * @param {HTMLElement} target
   */
  static #onUploadFile(event, target) {
    const fileInput = this.element.querySelector('input[type="file"]');
    fileInput?.click();
  }

  /**
   * Handle import from module button click.
   * @param {Event} event
   * @param {HTMLElement} target
   */
  static async #onImportFromModule(event, target) {
    const importer = this.#getSelectedImporter();
    if (!importer) return;

    try {
      const data = await importer.loadFromModule();
      await this.#processData(data);
    } catch (error) {
      log(2, 'Error loading from module:', error);
      this.#errorMessage = error.message;
      this.render();
    }
  }

  /**
   * Handle clear data button click.
   * @param {Event} event
   * @param {HTMLElement} target
   */
  static #onClearData(event, target) {
    this.#clearData();
    this.render();
  }

  /**
   * Handle form submission (import).
   * @param {Event} event
   * @param {HTMLFormElement} form
   * @param {FormDataExtended} formData
   */
  static async #onSubmit(event, form, formData) {
    if (!this.#transformedData) {
      ui.notifications.warn(game.i18n.localize('CALENDARIA.Importer.NoData'));
      return;
    }

    const data = formData.object;
    const calendarId = data.calendarId || this.#suggestedId;
    const importNotes = data.importNotes ?? true;

    this.#importing = true;
    this.render();

    try {
      const importer = this.#getSelectedImporter();
      const result = await importer.importCalendar(this.#transformedData, {
        id: calendarId,
        name: data.calendarName || this.#transformedData.name
      });

      if (result.success) {
        // Import notes if requested
        if (importNotes && this.#rawData) {
          const notes = await importer.extractNotes(this.#rawData);
          if (notes.length > 0) {
            const noteResult = await importer.importNotes(notes, { calendarId: result.calendarId });
            if (noteResult.count > 0) {
              ui.notifications.info(game.i18n.format('CALENDARIA.Importer.NotesImported', { count: noteResult.count }));
            }
          }
        }

        ui.notifications.info(game.i18n.format('CALENDARIA.Importer.Success', { name: this.#transformedData.name }));
        this.close();
      } else {
        this.#errorMessage = result.error;
        this.render();
      }
    } catch (error) {
      log(2, 'Import error:', error);
      this.#errorMessage = error.message;
    } finally {
      this.#importing = false;
      this.render();
    }
  }

  /* -------------------------------------------- */
  /*  Static API                                  */
  /* -------------------------------------------- */

  /**
   * Open the importer application.
   * @param {object} [options] - Application options
   * @returns {ImporterApp}
   */
  static open(options = {}) {
    const app = new this(options);
    app.render(true);
    return app;
  }
}
