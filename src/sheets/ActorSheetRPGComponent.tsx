import React, { useState, useEffect } from 'react';
import { rollDice } from '../utils/rollDice';
import { ATTRIBUTE_CONFIG } from '../utils/constants';

interface Props {
  actor: any;
  context: any;
}

export const ActorSheetRPGComponent: React.FC<Props> = ({ actor }) => {
  const system = actor.system;

  const [isEditing, setIsEditing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});

  useEffect(() => {
    setPendingChanges({});
  }, [actor.id]);

  const validateChanges = (): boolean => {
    const finalName = pendingChanges["name"] !== undefined ? pendingChanges["name"] : actor.name;
    if (!finalName || finalName.trim() === "") {
        // @ts-ignore
        ui.notifications.error("O personagem precisa de um nome para ser salvo!");
        return false;
    }
    return true;
  };

  const toggleEditMode = async () => {
    if (isEditing) {
        const isValid = validateChanges();
        if (!isValid) return;

        if (Object.keys(pendingChanges).length > 0) {
            console.log("Salvando alterações:", pendingChanges);
            try {
                await actor.update(pendingChanges);
                // @ts-ignore
                ui.notifications.info("Ficha salva com sucesso.");
            } catch (err) {
                console.error(err);
                // @ts-ignore
                ui.notifications.error("Erro ao salvar no banco de dados.");
                return;
            }
        }
        setPendingChanges({});
    }
    setIsEditing(!isEditing);
  };

  const getValue = (path: string, originalValue: any) => {
    if (isEditing && pendingChanges[path] !== undefined) {
        return pendingChanges[path];
    }
    return originalValue;
  };

  const handleLocalChange = (path: string, value: any) => {
    setPendingChanges(prev => ({
        ...prev,
        [path]: value
    }));
  };

  const handleImageClick = () => {
      if (isEditing) {
          // @ts-ignore
          new FilePicker({
              type: "image",
              callback: (path: string) => {
                  handleLocalChange("img", path);
              } 
          }).render(true);
      } else {
          // @ts-ignore
          const popout = new ImagePopout(actor.img, {
              title: actor.name,
              shareable: true,
              uuid: actor.uuid
          });
          popout.render(true);
      }
  };

  return (
    <div className="rpg-sheet-content" style={{ padding: '10px', color: '#eee', height: '100%', overflowY: 'auto', position: 'relative' }}>
      
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
        <button 
            onClick={toggleEditMode}
            title={isEditing ? "Salvar Alterações" : "Habilitar Edição"}
            style={{
                background: isEditing ? '#ff6400' : '#333',
                color: 'white',
                border: `1px solid ${isEditing ? '#ff6400' : '#555'}`,
                borderRadius: '20px',
                padding: '5px 15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9em',
                boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
            }}
        >
            <i className={`fas ${isEditing ? 'fa-pencil' : 'fa-gamepad'}`}></i>
            <span>{isEditing ? 'Editando' : 'Jogando'}</span>
        </button>
      </div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', marginTop: '40px' }}>
        
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleImageClick}>
            <img 
            src={getValue("img", actor.img)} 
            alt={actor.name} 
            style={{ 
                height: '100px', width: '100px', 
                border: isEditing ? '2px dashed #ff6400' : '1px solid #444',
                borderRadius: '4px', 
                objectFit: 'cover',
                opacity: isEditing ? 0.9 : 1
            }}
            />
            <div style={{
                position: 'absolute', bottom: 0, right: 0, 
                background: 'rgba(0,0,0,0.7)', color: 'white', 
                padding: '2px 5px', fontSize: '0.7em', borderRadius: '4px 0 4px 0',
                pointerEvents: 'none'
            }}>
                <i className={`fas ${isEditing ? 'fa-camera' : 'fa-search-plus'}`}></i>
            </div>
        </div>
        
        <div style={{ flex: 1 }}>
            <input 
              type="text" 
              value={getValue("name", actor.name)} 
              onChange={(e) => handleLocalChange("name", e.target.value)} 
              disabled={!isEditing} 
              className={isEditing && !getValue("name", actor.name) ? "error-pulse" : ""}
              style={{ 
                  width: '100%', fontSize: '1.8em', background: 'transparent', 
                  color: isEditing ? 'white' : '#aaa', 
                  border: 'none', 
                  borderBottom: isEditing 
                    ? (!getValue("name", actor.name) ? '2px solid red' : '1px solid #ff6400') 
                    : '1px solid #333', 
                  fontFamily: 'Signika, sans-serif',
                  pointerEvents: isEditing ? 'auto' : 'none'
              }}
              placeholder={isEditing ? "Obrigatório" : ""}
            />
        </div>
      </div>

      <hr style={{ borderColor: '#333' }} />

      <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
        Atributos
        {isEditing && <span style={{fontSize: '0.6em', color: '#ff6400', alignSelf: 'center'}}>MODO EDIÇÃO</span>}
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', marginTop: '10px' }}>
        
        {Object.entries(ATTRIBUTE_CONFIG).map(([key, {abbreviation}]) => {
            const attrPath = `system.attributes.${key}.value`;
            const attrData = system.attributes?.[key];
            
            if (!attrData) return null;

            const currentValue = getValue(attrPath, attrData.value || 0);

            return (
                <AttributeCard 
                    key={key} 
                    label={abbreviation} 
                    value={currentValue}
                    isEditable={isEditing}
                    onChange={(val: number) => handleLocalChange(attrPath, val)}
                    onRoll={() => {
                        if (!isEditing) {
                             rollDice({ actor: actor, initialKey: key });
                        }
                    }}
                />
            );
        })}
      
      </div>

      {isEditing && (
        <div style={{
            position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.8)', padding: '10px 20px', borderRadius: '30px',
            border: '1px solid #ff6400', color: '#ff6400', pointerEvents: 'none'
        }}>
            <i className="fas fa-pen"></i> Editando Ficha...
        </div>
      )}

    </div>
  );
};

interface CardProps {
    label: string;
    value: number;
    isEditable: boolean;
    onChange: (val: number) => void;
    onRoll: () => void;
}

const AttributeCard = ({ label, value, isEditable, onChange, onRoll }: CardProps) => {
    return (
        <div style={{ 
            background: isEditable ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)', 
            border: isEditable ? '1px solid #666' : '1px solid #444', 
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'all 0.3s ease'
        }}>
            <span 
                style={{ 
                    fontWeight: 'bold', fontSize: '0.8em', 
                    color: isEditable ? '#888' : '#ccc', 
                    marginBottom: '5px', textTransform: 'uppercase', textAlign: 'center',
                    cursor: isEditable ? 'default' : 'pointer'
                }} 
                onClick={onRoll}
                title={isEditable ? "" : "Clique para rolar"}
            >
                {label} 
                {!isEditable && <i className="fas fa-dice" style={{fontSize: '0.8em', marginLeft: 3}}></i>}
            </span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                    type="number" 
                    value={value} 
                    disabled={!isEditable} 
                    onChange={(e) => onChange(Number(e.target.value))}
                    style={{ 
                        width: '50px', textAlign: 'center', fontSize: '1.4em', 
                        background: isEditable ? 'rgba(0,0,0,0.5)' : 'transparent', 
                        border: isEditable ? '1px solid #ff6400' : 'none', 
                        color: isEditable ? 'white' : '#fff', 
                        borderRadius: '4px',
                        pointerEvents: isEditable ? 'auto' : 'none'
                    }}
                />
            </div>
        </div>
    );
};