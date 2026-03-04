import entity_management from '../assets/images/sidebar-icons/Entity_managment.svg';
import Modes from '../assets/images/sidebar-icons/Modes.svg';

// Sample data matching the image
export const sampleSidebarData = [
  {
    id: 'em-01233',
    title: 'Em_01233',
    icon: entity_management,
    children: [
      {
        id: 'em-01233_mode-1236',
        title: 'Mode_1236',
        icon: Modes,
        children: [
          {
            id: 'Em_01233_mode-1236_jamming',
            title: 'Jamming'
          }
        ]
      },
      {
        id: 'em-01233_mode-1237',
        title: 'Mode_1231',
        icon: Modes,
        children: [
          {
            id: 'Em_01233_mode-1237_jamming',
            title: 'Jamming'
          }
        ]
      }
    ]
  }
];

// Function to add new mode to sidebar data
export const addModeToSidebar = (sidebarData, emitterId, modeId, modeTitle) => {
  return sidebarData.map(emitter => {
    if (emitter.id === emitterId) {
      const newMode = {
        id: `${emitterId}_mode-${modeId}`,
        title: modeTitle,
        icon: Modes,
        children: [
          {
            id: `${emitterId}_mode-${modeId}_jamming`,
            title: 'Jamming'
          }
        ]
      };
      return {
        ...emitter,
        children: [...emitter.children, newMode]
      };
    }
    return emitter;
  });
};
