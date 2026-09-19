import React, { useState, useEffect } from 'react';
import { Eye, Download, RefreshCw, Save, Loader2 } from 'lucide-react';
import { countWords } from '../utils/helpers';
import EditionManager from './editor/EditionManager';
import PublishingChecklist from './editor/PublishingChecklist';
import StoryEditor from './editor/StoryEditor';
import WeeklySummaryEditor from './editor/WeeklySummaryEditor';
import EditorsNoteEditor from './editor/EditorsNoteEditor';
import BentoLivePreview from './editor/BentoLivePreview';

/**
 * EditorPanel Component
 * Main CMS studio orchestrator connecting Edition Manager, Story Editor (1-5),
 * Live Bento Preview, and Publishing Checklist to the backend API.
 */
export default function EditorPanel({
  editions,
  activeEdition,
  draftEdition: propDraftEdition,
  onUpdateDraftEdition,
  onPublishEdition,
  onSaveDraft,
  onCreateEdition,
  onDeleteEdition,
  onResetDefaults,
  onSelectEdition,
  onShowToast,
  onSwitchToReader,
  isSaving,
  isPublishing
}) {
  const [selectedStorySlot, setSelectedStorySlot] = useState(1); // 1 to 5
  const [activeTab, setActiveTab] = useState('stories'); // 'stories' | 'summary' | 'editorNote' | 'preview'
  
  // Use prop draft if provided by parent (App), otherwise fallback to local draft state
  const [localDraftEdition, setLocalDraftEdition] = useState(activeEdition);

  useEffect(() => {
    setLocalDraftEdition(activeEdition);
  }, [activeEdition?.id]);

  const draftEdition = propDraftEdition || localDraftEdition || {};

  const updateDraft = (updated) => {
    if (onUpdateDraftEdition) {
      onUpdateDraftEdition(updated);
    } else {
      setLocalDraftEdition(updated);
    }
  };

  // --- Handlers for updating Edition & Stories in DRAFT ---
  const handleUpdateEditionField = (field, value) => {
    const updatedEdition = {
      ...draftEdition,
      [field]: value
    };
    updateDraft(updatedEdition);
  };

  const handleUpdateStory = (slot, updatedFields) => {
    const updatedStories = (draftEdition.stories || []).map((story) => {
      if (story.slot === slot) {
        return { ...story, ...updatedFields };
      }
      return story;
    });

    const updatedEdition = {
      ...draftEdition,
      stories: updatedStories
    };
    updateDraft(updatedEdition);
  };

  const handleSwapSlots = (direction) => {
    const currentSlot = selectedStorySlot;
    const targetSlot = direction === 'up' ? currentSlot - 1 : currentSlot + 1;
    if (targetSlot < 1 || targetSlot > 5) return;

    const updatedStories = (draftEdition.stories || []).map((story) => {
      if (story.slot === currentSlot) return { ...story, slot: targetSlot };
      if (story.slot === targetSlot) return { ...story, slot: currentSlot };
      return story;
    });

    const updatedEdition = { ...draftEdition, stories: updatedStories };
    updateDraft(updatedEdition);
    setSelectedStorySlot(targetSlot);
    onShowToast(`Swapped Story #${currentSlot} with Story #${targetSlot} (client session)`);
  };

  // --- Publishing Checklist Validation ---
  const leadStory = (draftEdition.stories || []).find((s) => s.slot === 1);
  const leadStoryComplete = Boolean(
    leadStory?.title &&
    leadStory?.imageUrl &&
    (leadStory?.takeaways?.length || 0) > 0
  );
  const allStoriesHaveTitles = (draftEdition.stories || []).every(
    (s) => s.title && s.title.trim().length > 3
  );
  const weeklySummaryValid = Boolean(
    draftEdition.weeklySummary && countWords(draftEdition.weeklySummary) >= 30
  );
  const editorNoteValid = Boolean(
    draftEdition.editorsNote && draftEdition.editorsNote.trim().length > 20
  );
  const dateValid = Boolean(draftEdition.publishDate);

  const checklist = [
    { label: 'All 5 Bento stories populated with headlines', done: allStoriesHaveTitles },
    { label: 'Story #1 (Lead Story) has hero image & takeaways', done: leadStoryComplete },
    { label: '"The Week, in 150 Words" narrative written (>=30 words)', done: weeklySummaryValid },
    { label: '"From the Editor" perspective note provided', done: editorNoteValid },
    { label: 'Edition number & publication date set', done: dateValid }
  ];

  const isReadyToPublish = checklist.every((item) => item.done);

  // --- Publish Handler ---
  const handlePublish = async () => {
    if (onPublishEdition) {
      await onPublishEdition(draftEdition, 'publish');
    }
  };

  // --- Save Draft Handler ---
  const handleSave = async () => {
    if (onSaveDraft) {
      await onSaveDraft(draftEdition);
    }
  };

  // --- Export JSON ---
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(editions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'weekly-tech-journal-editions.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Exported editions JSON file!');
  };

  return (
    <div className="editor-studio-container">
      {/* 1. Left Sidebar: Edition Manager & Publishing Checklist */}
      <aside className="editor-sidebar">
        <EditionManager
          edition={draftEdition}
          editions={editions}
          onSelectEdition={(id) => {
            if (onSelectEdition) {
              onSelectEdition(id);
            } else {
              const ed = editions.find(e => e.id === id || e.number === id);
              if (ed) {
                updateDraft(ed);
                onShowToast(`Editing Edition #${ed.number}`);
              }
            }
          }}
          onUpdateField={handleUpdateEditionField}
          onCreateNewEdition={onCreateEdition}
          onPublish={handlePublish}
          onSaveDraft={handleSave}
          onDeleteEdition={onDeleteEdition}
          isReadyToPublish={isReadyToPublish}
          isSaving={isSaving}
          isPublishing={isPublishing}
        />

        <PublishingChecklist
          checklist={checklist}
          isReadyToPublish={isReadyToPublish}
        />

        {/* Utility Tools */}
        <div className="editor-card" style={{ padding: '0.85rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              className="btn-icon"
              style={{ width: '100%', fontSize: '0.75rem', gap: '0.35rem' }}
              onClick={handleExportJSON}
              title="Export all editions as JSON"
            >
              <Download size={14} />
              <span>Export JSON</span>
            </button>

            <button
              className="btn-icon"
              style={{ width: '100%', fontSize: '0.75rem', gap: '0.35rem' }}
              onClick={() => {
                if (window.confirm('Reset local draft edits back to current saved edition?')) {
                  updateDraft(activeEdition);
                  onShowToast('Reset draft to current edition data.');
                }
              }}
              title="Reset current draft"
            >
              <RefreshCw size={14} />
              <span>Reset Draft</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area: Tabbed Editors & Live Preview */}
      <main className="editor-main-panel">
        {/* Editor Tabs Navigation */}
        <div className="editor-nav-tabs">
          <button
            className={`editor-tab-btn ${activeTab === 'stories' ? 'active' : ''}`}
            onClick={() => setActiveTab('stories')}
          >
            Top 5 Stories
          </button>

          <button
            className={`editor-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Weekly 150-Word Summary
          </button>

          <button
            className={`editor-tab-btn ${activeTab === 'editorNote' ? 'active' : ''}`}
            onClick={() => setActiveTab('editorNote')}
          >
            Editor's Note & Bio
          </button>

          <button
            className={`editor-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Live Bento Preview
          </button>
        </div>

        {/* TAB 1: 5 Stories Editor */}
        {activeTab === 'stories' && (
          <StoryEditor
            stories={draftEdition.stories || []}
            selectedSlot={selectedStorySlot}
            onSelectSlot={setSelectedStorySlot}
            onUpdateStory={handleUpdateStory}
            onSwapSlots={handleSwapSlots}
          />
        )}

        {/* TAB 2: Weekly 150-Word Summary */}
        {activeTab === 'summary' && (
          <WeeklySummaryEditor
            weeklySummary={draftEdition.weeklySummary}
            onChangeSummary={(val) => handleUpdateEditionField('weeklySummary', val)}
          />
        )}

        {/* TAB 3: Editor's Note */}
        {activeTab === 'editorNote' && (
          <EditorsNoteEditor
            editorsNote={draftEdition.editorsNote}
            editor={draftEdition.editor}
            onChangeNote={(val) => handleUpdateEditionField('editorsNote', val)}
            onChangeEditor={(field, val) =>
              handleUpdateEditionField('editor', {
                ...(draftEdition.editor || {}),
                [field]: val
              })
            }
          />
        )}

        {/* TAB 4: Live Bento Preview */}
        {activeTab === 'preview' && (
          <BentoLivePreview
            edition={draftEdition}
            onSelectStoryToEdit={(slot) => {
              setSelectedStorySlot(slot);
              setActiveTab('stories');
              onShowToast(`Opened Story #${slot} in Editor`);
            }}
          />
        )}
      </main>
    </div>
  );
}
