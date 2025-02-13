import React, { useState } from 'react';

const Item = ({ index, item, onItemChange, onItemRemove }) => {
    return (
        <div
            className='vendor-input-group-styles'
            style={{
                width: "15vw",
            }}
        >
            <input
                className='vendor-input-field-styles'
                type="text"
                placeholder="Item Name"
                value={item.name}
                onChange={(e) => onItemChange(index, 'name', e.target.value)}
            />
            <input
                className='vendor-input-field-styles'
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => onItemChange(index, 'price', e.target.value)}
            />
            <div className='vendor-show-hide-styles' onClick={() => onItemRemove(index)}>Remove Item</div>
        </div>
    );
};

const EmployeeInterfaceDesigner = () => {
    const [groups, setGroups] = useState([]);

    const handleAddGroup = () => {
        setGroups([
            ...groups,
            {
                groupName: '',
                items: [{ name: '', price: '' }],
            },
        ]);
    };

    const handleRemoveGroup = (groupIndex) => {
        const updatedGroups = groups.filter((_, index) => index !== groupIndex);
        setGroups(updatedGroups);
    };

    const handleAddItem = (groupIndex) => {
        const updatedGroups = [...groups];
        updatedGroups[groupIndex].items.push({ name: '', price: '' });
        setGroups(updatedGroups);
    };

    // Handle removing an item from a specific group
    const handleRemoveItem = (groupIndex, itemIndex) => {
        const updatedGroups = [...groups];
        updatedGroups[groupIndex].items = updatedGroups[groupIndex].items.filter(
            (_, index) => index !== itemIndex
        );
        setGroups(updatedGroups);
    };

    // Handle changes to the group name or item properties
    const handleGroupChange = (groupIndex, field, value) => {
        const updatedGroups = [...groups];
        updatedGroups[groupIndex][field] = value;
        setGroups(updatedGroups);
    };

    const handleItemChange = (groupIndex, itemIndex, field, value) => {
        const updatedGroups = [...groups];
        updatedGroups[groupIndex].items[itemIndex][field] = value;
        setGroups(updatedGroups);
    };

    return (
        <div>
            {groups.map((group, groupIndex) => (
                <div key={groupIndex} className="group"
                    style={{
                        border: "solid black 1px",
                        width: '30vw',
                        transform: 'scale(0.75)',
                        transformOrigin: "top left",
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}>
                    <div
                        className='vendor-input-group-styles'
                        style={{
                            width: '25vw', background: "linear-gradient(45deg, #ffffff, transparent)",
                            border: "solid #ffffff 2px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Group Name"
                            className='vendor-input-field-styles'
                            value={group.groupName}
                            onChange={(e) =>
                                handleGroupChange(groupIndex, 'groupName', e.target.value)
                            }
                        />
                        <div className='vendor-show-hide-styles' onClick={() => handleRemoveGroup(groupIndex)}>Remove Group</div>
                    </div>

                    {group.items.map((item, itemIndex) => (
                        <Item
                            key={itemIndex}
                            index={itemIndex}
                            item={item}
                            onItemChange={(index, field, value) => handleItemChange(groupIndex, index, field, value)}
                            onItemRemove={(index) => handleRemoveItem(groupIndex, index)}
                        />
                    ))}
                    <div className='vendor-show-hide-styles' onClick={() => handleAddItem(groupIndex)}>Add Item</div>
                </div>
            ))}
            <div className='vendor-show-hide-styles' onClick={handleAddGroup}>Add Group</div>
        </div>
    );
};

export default EmployeeInterfaceDesigner;
