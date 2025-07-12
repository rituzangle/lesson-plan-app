// Destination: src/components/ui/TemplateSelector.tsx
// Template selector component with preview functionality

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { LessonTemplate } from '../../types/lesson.types';
import { LessonService } from '../../services/lesson.service';

interface TemplateSelectorProps {
  subject: string;
  onSelectTemplate: (template: LessonTemplate) => void;
  disabled?: boolean;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  subject,
  onSelectTemplate,
  disabled = false
}) => {
  const [templates, setTemplates] = useState<LessonTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<LessonTemplate | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subject) {
      loadTemplates();
    }
  }, [subject]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const subjectTemplates = await LessonService.getTemplates(subject);
      setTemplates(subjectTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      Alert.alert('Error', 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: LessonTemplate) => {
    setSelectedTemplate(template);
    setIsModalVisible(false);
    setIsPreviewVisible(true);
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      setIsPreviewVisible(false);
    }
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (!subject) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Select a subject first to see available templates</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Lesson Templates</Text>
      
      <TouchableOpacity
        style={[
          styles.templateSelector,
          disabled && styles.templateSelectorDisabled
        ]}
        onPress={() => !disabled && setIsModalVisible(true)}
        disabled={disabled}
      >
        <View style={styles.selectorContent}>
          <Text style={styles.selectorText}>
            {selectedTemplate ? selectedTemplate.name : 'Choose a template (optional)'}
          </Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </View>
      </TouchableOpacity>

      {/* Template Selection Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Template</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.templateList}>
              {loading ? (
                <Text style={styles.loadingText}>Loading templates...</Text>
              ) : templates.length === 0 ? (
                <Text style={styles.emptyText}>No templates available for {subject}</Text>
              ) : (
                templates.map((template) => (
                  <TouchableOpacity
                    key={template.id}
                    style={styles.templateOption}
                    onPress={() => handleTemplateSelect(template)}
                  >
                    <View style={styles.templateInfo}>
                      <Text style={styles.templateName}>{template.name}</Text>
                      <Text style={styles.templateDescription}>
                        {template.description}
                      </Text>
                      <View style={styles.templateMeta}>
                        <Text style={styles.templateDuration}>
                          {formatDuration(template.duration)}
                        </Text>
                        <Text style={styles.templateActivities}>
                          {template.activities.length} activities
                        </Text>
                      </View>
                      <View style={styles.templateTags}>
                        {template.tags.map((tag, index) => (
                          <Text key={index} style={styles.templateTag}>
                            {tag}
                          </Text>
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Template Preview Modal */}
      <Modal
        visible={isPreviewVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPreviewVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Template Preview</Text>
              <TouchableOpacity
                onPress={() => setIsPreviewVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {selectedTemplate && (
              <ScrollView style={styles.previewContent}>
                <Text style={styles.previewTitle}>{selectedTemplate.name}</Text>
                <Text style={styles.previewDescription}>
                  {selectedTemplate.description}
                </Text>
                
                <View style={styles.previewMeta}>
                  <Text style={styles.previewMetaItem}>
                    Duration: {formatDuration(selectedTemplate.duration)}
                  </Text>
                  <Text style={styles.previewMetaItem}>
                    Grade: {selectedTemplate.gradeLevel}
                  </Text>
                </View>

                <Text style={styles.previewSectionTitle}>Activities</Text>
                {selectedTemplate.activities.map((activity, index) => (
                  <View key={activity.id} style={styles.previewActivity}>
                    <Text style={styles.previewActivityTitle}>
                      {index + 1}. {activity.title}
                    </Text>
                    <Text style={styles.previewActivityDescription}>
                      {activity.description}
                    </Text>
                    <Text style={styles.previewActivityDuration}>
                      {activity.duration} minutes
                    </Text>
                  </View>
                ))}

                <Text style={styles.previewSectionTitle}>Materials</Text>
                {selectedTemplate.materials.map((material, index) => (
                  <Text key={index} style={styles.previewMaterial}>
                    • {material}
                  </Text>
                ))}
              </ScrollView>
            )}
            
            <View style={styles.previewActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsPreviewVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyTemplate}
              >
                <Text style={styles.applyButtonText}>Apply Template</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  templateSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  templateSelectorDisabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  templateList: {
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    padding: 20,
  },
  templateOption: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  templateMeta: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  templateDuration: {
    fontSize: 12,
    color: '#007AFF',
    marginRight: 16,
  },
  templateActivities: {
    fontSize: 12,
    color: '#666',
  },
  templateTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  templateTag: {
    fontSize: 10,
    color: '#666',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 2,
  },
  previewContent: {
    padding: 16,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  previewMeta: {
    marginBottom: 16,
  },
  previewMetaItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  previewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  previewActivity: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  previewActivityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  previewActivityDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  previewActivityDuration: {
    fontSize: 11,
    color: '#007AFF',
    marginTop: 2,
  },
  previewMaterial: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    flex: 0.45,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 0.45,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TemplateSelector;