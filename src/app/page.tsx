"use client"
import { useRef, useState } from 'react'
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronsUpDown, Loader2, X } from 'lucide-react';
import { Person } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import clsx from 'clsx';


export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [activePersons, setActivePersons] = useState<Person[]>([])
  const [query, setQuery] = useState('');

  const { data: filteredPeople, isLoading } = useQuery({
    queryKey: ['people', query],
    queryFn: async () => {
      const res = await fetch(`/api/person?q=${query}`)
      return res.json();
    }
  });

  const items = filteredPeople || [];

  function handleSelect(person: Person[]) {
    setActivePersons(person)
    setQuery('')
    setTimeout(() => {
      console.log('blue')
      console.log(inputRef.current)
      inputRef.current?.blur()
      buttonRef.current?.click();
    });
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <Label htmlFor="person-search">Person</Label>
          <div className="relative">
            <Combobox value={activePersons} onChange={handleSelect} multiple>
              <div className="relative">
                <span className="inline-block w-full rounded-md shadow-sm">
                  <div
                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  >
                    <span className="block flex flex-wrap gap-2">
                      {activePersons.map((person) => (
                        <span
                          key={person.id}
                          className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                        >
                          <span>{person.name}</span>
                          <X className="w-4 h-4 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              setActivePersons((existing) => existing.filter((p) => p !== person))
                            }}

                          />
                        </span>
                      ))}
                      <Combobox.Input
                        id="person-search"
                        ref={inputRef}
                        className="border-none p-0 focus:ring-0"
                        aria-label="Assignee"
                        placeholder="Search..."
                        onBlur={() => setQuery('')}
                        onChange={(event) => setQuery(event.target.value)}
                        autoComplete="off"
                      />
                    </span>
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none" ref={buttonRef}>
                      <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Combobox.Button>
                  </div>
                </span>
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {!isLoading && items.length === 0 && (
                    <div
                      className="data-[focus]:bg-blue-600 group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:text-white"
                    >
                      There are no results.
                    </div>
                  )}
                  {items.length > 0 && items.map((person: Person) => (
                    <Combobox.Option
                      value={person}
                      key={person.id}
                      className={({ active }) => {
                        return clsx(
                          'relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 focus:outline-none focus:bg-blue-600 focus:text-white',
                          active ? 'bg-blue-600 text-white' : 'text-gray-900'
                        )
                      }}
                    >
                      {({ active, selected }) => (
                        <>
                          <span className="block truncate group-data-[selected]:font-semibold">
                            {person.name}
                          </span>
                          {selected && (
                            <span className={clsx('absolute inset-y-0 right-0 items-center pr-4 flex focus:text-white', active ? 'text-white' : 'text-blue-600')}>
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>

                          )}
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>

        </div>
      </main>
    </div>
  );
}
