import React, { useEffect, useState } from 'react';
import { Card, Image, Text, Button, Container, SimpleGrid } from '@mantine/core';
import { createPortal } from 'react-dom';

interface Launch {
  mission_name: string;
  rocket: {
    rocket_name: string;
  };
  links: {
    mission_patch_small: string;
    mission_patch: string; 
  };
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  launch: Launch | null;
}

const PortalModal: React.FC<ModalProps> = ({ isOpen, onClose, launch }) => {
  if (!isOpen || !launch || typeof document === 'undefined') return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute', top: 12, right: 12, cursor: 'pointer', 
            background: 'none', border: 'none', fontSize: '20px', fontWeight: 'bold' 
          }}
        >
          ✕
        </button>
        
        <Image
          src={launch.links?.mission_patch || 'https://via.placeholder.com/300'}
          alt={launch.mission_name}
          height={200}
          fit="contain"
          mb="md"
        />
        
        <Text size="xl" fw={700}>
          {launch.mission_name}
        </Text>
        
        <Text c="blue" fw={500} mb="sm">
          Rocket: {launch.rocket?.rocket_name}
        </Text>
        
        <Text size="sm" c="dimmed">
          {launch.details ? launch.details : 'No details available for this mission.'}
        </Text>
      </div>
    </div>,
    document.body
  );
};


interface LaunchCardProps extends Launch {
  onOpenModal: () => void;
}

const LaunchCard: React.FC<LaunchCardProps> = ({ mission_name, rocket, links, onOpenModal }) => {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Card.Section>
        <Image
          src={links?.mission_patch_small}
          alt={mission_name}
          height={160}
          fit="contain"
        />
      </Card.Section>

      <Text fw={500} mt="md">
        {mission_name}
      </Text>
      <Text c="dimmed" size="sm">
        {rocket?.rocket_name}
      </Text>

      <Button 
        variant="light" 
        color="blue" 
        fullWidth 
        style={{ marginTop: 14 }}
        onClick={onOpenModal}
      >
        See more
      </Button>
    </Card>
  );
};


const App: React.FC = () => {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null);

  useEffect(() => {
    fetch('https://api.spacexdata.com/v3/launches?launch_year=2020')
      .then((response) => response.json())
      .then((data: Launch[]) => {
        setLaunches(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <React.Fragment>
      <Container size="xl" mt="md">
        <h1>SpaceX Launches 2020</h1>
        <SimpleGrid cols={3} spacing="md">
          {launches.map((launch, index) => (
            <LaunchCard 
              key={index} 
              {...launch} 
              onOpenModal={() => setSelectedLaunch(launch)} 
            />
          ))}
        </SimpleGrid>
      </Container>

      <PortalModal 
        isOpen={!!selectedLaunch} 
        launch={selectedLaunch} 
        onClose={() => setSelectedLaunch(null)} 
      />
    </React.Fragment>
  );
};

export default App;
